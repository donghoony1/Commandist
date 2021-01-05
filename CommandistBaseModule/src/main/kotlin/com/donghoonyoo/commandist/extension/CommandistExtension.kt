package com.donghoonyoo.commandist.extension

import com.donghoonyoo.commandist.extension.annotation.Command
import com.donghoonyoo.commandist.extension.annotation.DefaultExecutor
import com.donghoonyoo.commandist.extension.annotation.Parameter
import com.donghoonyoo.commandist.extension.model.CommandResult
import com.donghoonyoo.commandist.extension.model.CommandSet
import com.donghoonyoo.commandist.extension.model.Module
import com.donghoonyoo.commandist.extension.model.VirtualKParameter
import com.google.common.reflect.ClassPath
import kotlinx.cli.ArgParser
import kotlinx.cli.ArgType
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import java.lang.IllegalArgumentException
import java.lang.instrument.IllegalClassFormatException
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.functions
import kotlin.reflect.full.hasAnnotation
import kotlin.reflect.jvm.jvmName
import kotlin.reflect.typeOf

object CommandistExtension {
    private val config =
        Json.decodeFromString<Module>(javaClass.getResource("commandist.json").readText(Charsets.UTF_8))

    @ExperimentalStdlibApi
    private val requiredParameters = listOf(
        VirtualKParameter(0, "callback", typeOf<(List<CommandResult>) -> Unit>()),
        VirtualKParameter(1, "fullCommand", typeOf<String>()),
        VirtualKParameter(2, "afterParameter", typeOf<String>()),
        VirtualKParameter(3, "args", typeOf<List<String>>())
    )

    @ExperimentalStdlibApi
    val commandSets = mutableMapOf<String, CommandSet>().apply {
        val whitespace = Regex("\\s")
        getAllClassesAnnotatedWith<Command>(config.PackagePrefix).forEach { kclass ->
            val defaultExecutors = kclass.functions.filter { it.hasAnnotation<DefaultExecutor>() }
            if(1 < defaultExecutors.size) {
                throw IllegalClassFormatException("${kclass.jvmName} has multiple functions which have @DefaultExecutors annotation.")
            }
            this[kclass.findAnnotation<Command>()!!.command] =
                CommandSet(
                    kclass,
                    defaultExecutors.firstOrNull(),
                    mutableMapOf<String, KFunction<*>>().apply {
                        kclass.functions.filter { kfunction ->
                            kfunction.hasAnnotation<Parameter>()
                                    && requiredParameters.all { vk ->
                                !kfunction.parameters.all {
                                    it.index != vk.index
                                            || it.name != vk.name
                                            || it.type != vk.type
                                }
                            }
                        }.forEach {
                            put(it.findAnnotation<Parameter>()!!.parameter.also {
                                if(it.contains(whitespace)) {
                                    throw IllegalArgumentException("${it}@${kclass.jvmName} has whitespace.")
                                }
                            }, it)
                        }
                    }.toMap()
                )
        }
    }.toMap()

    @JvmStatic
    @ExperimentalStdlibApi
    fun main(args: Array<String>) {
        val parser = ArgParser("CommandistModule")
        val review by parser.option(
            ArgType.Boolean,
            shortName = "r",
            description = "If it requires to review that all functions in your components have correct parameters, Use this option as \"true\"."
        )
        val verbose by parser.option(
            ArgType.Boolean,
            shortName = "v",
            description = "If it requires to watch logs of passed components, Use this option as \"true\". It may run in --review or -r mode."
        )
        parser.parse(args)

        if (review == true) {
            commandSets.map { it.value.command }.forEach { kclass ->
                val command = kclass.findAnnotation<Command>()!!.command

                val (parameters, others) = kclass.functions.partition { it.hasAnnotation<Parameter>() }
                val defaultExecutors = others.filter { it.hasAnnotation<DefaultExecutor>() }

                when (defaultExecutors.size) {
                    0 -> {
                        println("[WARN] $command@${kclass.jvmName} hasn't @DefaultExecutor.")
                    }
                    1 -> {
                        println("[INFO] [TEST PASSED] $command@${kclass.jvmName} | defaultExecutor@${defaultExecutors[0].name}")
                    }
                }

                parameters.forEach { kfunction ->
                    val parameter = kclass.findAnnotation<Parameter>()!!
                    if (requiredParameters.all { vk ->
                            !kfunction.parameters.all {
                                it.index != vk.index
                                        || it.name != vk.name
                                        || it.type != vk.type
                            }
                        }) {
                        if (verbose == true) {
                            println("[INFO] [TEST PASSED] $command@${kclass.jvmName} | $parameter@${kfunction.name}")
                        }
                    } else {
                        println("[FATAL] [TEST FAILED] $command@${kclass.jvmName} | $parameter@${kfunction.name}")
                    }
                }
            }
            return
        }

        while (true) {
            CommandProcessor.execute(readLine()!!)
        }
    }

    private inline fun <reified T : Annotation> getAllClassesAnnotatedWith(Prefix: String): List<KClass<*>> =
        ClassPath.from(ClassLoader.getSystemClassLoader())
            .getTopLevelClassesRecursive(Prefix)
            .map { it.load().kotlin }
            .filter { it.hasAnnotation<T>() }
}