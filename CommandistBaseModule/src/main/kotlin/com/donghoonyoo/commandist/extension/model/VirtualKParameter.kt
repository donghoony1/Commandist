package com.donghoonyoo.commandist.extension.model

import kotlin.reflect.KType

data class VirtualKParameter(val index: Int,
                             val name: String,
                             val type: KType)