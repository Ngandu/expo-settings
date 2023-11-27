package expo.modules.settings

import android.Manifest
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import androidx.core.os.bundleOf
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.types.Enumerable
import android.os.Bundle
import android.widget.Toast
import android.hardware.usb.UsbDevice
import android.hardware.usb.UsbManager
import android.hardware.usb.UsbAccessory

import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.util.Log

import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothManager
import android.bluetooth.BluetoothProfile
import android.app.Activity

const val kRequestCode = 1

class ExpoSettingsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoSettings")

    Events("onChangeTheme")

    Function("setTheme") { theme: Theme ->
      getPreferences().edit().putString("theme", theme.value).commit()
      this@ExpoSettingsModule.sendEvent("onChangeTheme", bundleOf("theme" to theme.value))
    }

    Function("getTheme") {
      return@Function getPreferences().getString("theme", Theme.SYSTEM.value)
    }

    Function("boom"){
      return@Function boom()
    }

    Function("show"){
      return@Function myFun()
    }

    Function("requestPermissions") {
      return@Function requestP()
    }

  }

  private val context
  get() = requireNotNull(appContext.reactContext)

  private val intent  = Intent()


  private fun getPreferences(): SharedPreferences {
    return context.getSharedPreferences(context.packageName + ".settings", Context.MODE_PRIVATE)
  }

  private fun myFun() {
    val toast = Toast.makeText(context,"Helloworld",Toast.LENGTH_SHORT).show()
    return toast
  }

  private fun requestP(){
    val activity = appContext.activityProvider?.currentActivity
      val applicationContext = activity?.applicationContext
      if(applicationContext != null) {
        val permissionCheck = ContextCompat.checkSelfPermission(
          applicationContext,
          Manifest.permission.ACTIVITY_RECOGNITION
        )
        if (permissionCheck != PackageManager.PERMISSION_GRANTED) {
          ActivityCompat.requestPermissions(
            activity,
            arrayOf(Manifest.permission.ACTIVITY_RECOGNITION),
            kRequestCode
          )
        }
      }
  }


  private fun boom():String{
    val manager = context.getSystemService(Context.USB_SERVICE) as UsbManager
    val connectedDevices = manager.getDeviceList()

    if (connectedDevices.isEmpty()) {
      return "No devices"
    }
    else{
      return "has devices"
    }
  }

}

enum class Theme(val value: String) : Enumerable {
  LIGHT("light"),
  DARK("dark"),
  SYSTEM("system")
}
