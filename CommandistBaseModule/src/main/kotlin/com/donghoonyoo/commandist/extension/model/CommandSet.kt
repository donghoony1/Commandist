package com.donghoonyoo.commandist.extension.model

import kotlin.reflect.KClass
import kotlin.reflect.KFunction

data class CommandSet(val command: KClass<*>,
                      val parameters: Map<String, KFunction<*>>)
