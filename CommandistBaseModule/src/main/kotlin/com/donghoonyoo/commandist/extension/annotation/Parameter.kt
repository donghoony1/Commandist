package com.donghoonyoo.commandist.extension.annotation

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class Parameter(val parameter: String, val timeout: Long)