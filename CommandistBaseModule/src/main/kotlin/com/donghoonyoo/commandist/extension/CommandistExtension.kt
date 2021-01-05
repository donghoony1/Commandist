package com.donghoonyoo.commandist.extension

import com.donghoonyoo.commandist.extension.annotation.Command
import com.donghoonyoo.commandist.extension.annotation.Parameter
import com.donghoonyoo.commandist.extension.annotation.requiredParameters
import com.donghoonyoo.commandist.extension.model.CommandSet
import com.donghoonyoo.commandist.extension.model.Module
import com.google.common.reflect.ClassPath
import kotlinx.cli.ArgParser
import kotlinx.cli.ArgType
import kotlinx.serialization.decodeFromString
import kotlinx.serialization.json.Json
import kotlin.reflect.KClass
import kotlin.reflect.KFunction
import kotlin.reflect.full.findAnnotation
import kotlin.reflect.full.functions
import kotlin.reflect.full.hasAnnotation
import kotlin.reflect.jvm.jvmName

object CommandistExtension {
    private val config = Json.decodeFromString<Module>(javaClass.getResource("commandist.json").readText(Charsets.UTF_8))
    private val commandSets = mutableMapOf<String, CommandSet>().apply {
        getAllClassesAnnotatedWith<Command>(config.PackagePrefix).forEach { kclass ->
            this[kclass.findAnnotation<Command>()!!.command] =
                CommandSet(kclass, mutableMapOf<String, KFunction<*>>().apply {
                    kclass.functions.filter { it.hasAnnotation<Parameter>() }.forEach {
                        put(it.findAnnotation<Parameter>()!!.parameter, it)
                    }
                }.toMap())
        }
    }

    @JvmStatic
    @ExperimentalStdlibApi
    fun main(args: Array<String>) {
        val parser = ArgParser("CommandistModule")
        val review by parser.option(ArgType.Boolean,
            shortName = "r",
            description = "If it requires to review that all functions in your components have correct parameters, Use this option as \"true\".")
        val verbose by parser.option(ArgType.Boolean,
            shortName = "v",
            description = "If it requires to watch logs of passed components, Use this option as \"true\". It may run in --review or -r mode.")
        parser.parse(args)

        if(review == true) {
            commandSets.forEach { (command, commandSet) ->
                commandSet.parameters.forEach { (parameter, kfunction) ->
                    if (requiredParameters.all { vk -> !kfunction.parameters.all { it.index != vk.index || it.name != vk.name || it.type != vk.type } }) {
                        if(verbose == true) {
                            println("[PASSED] $command@${commandSet.command.jvmName} | $parameter@${kfunction.name}")
                        }
                    } else {
                        println("[FAILED] $command@${commandSet.command.jvmName} | $parameter@${kfunction.name}")
                    }
                }
            }
            return
        }

        while(true) {
            CommandProcessor.execute(readLine()!!)
        }
    }

    private inline fun <reified T : Annotation> getAllClassesAnnotatedWith(Prefix: String): List<KClass<*>> =
        ClassPath.from(ClassLoader.getSystemClassLoader())
            .getTopLevelClassesRecursive(Prefix)
            .map { it.load().kotlin }
            .filter { it.hasAnnotation<T>() }
}