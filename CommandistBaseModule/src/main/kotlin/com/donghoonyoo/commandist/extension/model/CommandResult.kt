package com.donghoonyoo.commandist.extension.model

import com.donghoonyoo.commandist.extension.result.General
import com.donghoonyoo.commandist.extension.result.WebView
import java.lang.IllegalArgumentException
import kotlin.reflect.KClass

val allowedResultsClass = listOf(
    General::class,
    WebView::class
)
data class CommandResult(val data: KClass<*>) {
    init {
        if(data::class !in allowedResultsClass) {
            // TODO: Replace to com.donghoonyoo.commandist.extension.result.Error
            throw IllegalArgumentException("The type of data is allowed in General and WebView.")
        }
    }

    fun print(fullCommand: String) {
        // TODO: Print json
    }
}
