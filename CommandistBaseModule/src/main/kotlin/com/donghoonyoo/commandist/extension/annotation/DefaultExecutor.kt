package com.donghoonyoo.commandist.extension.annotation

@Target(AnnotationTarget.FUNCTION)
@Retention(AnnotationRetention.RUNTIME)
annotation class DefaultExecutor(val timeout: Long)