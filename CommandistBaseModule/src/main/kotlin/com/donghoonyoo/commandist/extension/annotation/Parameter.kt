package com.donghoonyoo.commandist.extension.annotation

import com.donghoonyoo.commandist.extension.model.CommandResult
import com.donghoonyoo.commandist.extension.model.VirtualKParameter
import kotlin.reflect.typeOf

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Parameter(val parameter: String, val timeout: Long)

@ExperimentalStdlibApi
val requiredParameters = listOf(
    VirtualKParameter(0, "callback", typeOf<(CommandResult) -> Unit>()),
    VirtualKParameter(1, "fullCommand", typeOf<String>()),
    VirtualKParameter(2, "afterParameter", typeOf<String>())
)