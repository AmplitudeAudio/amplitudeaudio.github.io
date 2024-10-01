---
title: Engine Configuration
description: Amplitude has been built to let you have complete freedom on the behavior of the engine at runtime, and everything is specified in the configuration file.
menu:
  docs:
    parent: project-setup
weight: 302
toc: true
---

Amplitude has been built in a way to let you have complete freedom on the behavior of the engine at runtime. You can create several configuration files per device (PC, mobile, console), per platform (Windows, Android, XBOX, PlayStation), or any other criteria your project has to suit, then pick and load the right settings file at runtime.

{{< alert >}}
The flatbuffers schema of this file can be found [here](https://github.com/AmplitudeAudio/sdk/blob/main/schemas/engine_config_definition.fbs).
{{< /alert >}}

The config file will let you customize:

- The playback device ([output])
- The Amplitude Mixer, called **Amplimix** ([mixer])
- The synchronization with the game ([game])
- The path to the buses file ([buses_file])
- The name of the driver implementation to use ([driver])

[output]: #output
[mixer]: #mixer
[game]: #game
[buses_file]: #buses_file
[driver]: #driver

## output

`object` `required`

The `output` property helps you define how Amplitude should communicate with the physical audio device. It takes as value an object with the following properties:

### frequency

`uint` `default: 48000`

The `frequency` property defines the audio frequency in Hertz (`Hz`) of the audio data sent to the audio device by Amplitude. This value may differ from the frequency of the audio device, in such a scenario, the audio data will be resampled from this value to the device's frequency.

### buffer_size

`int` `default: 1024`

This value defines the number of audio bytes used per mix. The number of samples to produce for each output will be calculated automatically by dividing this value by the number of channels. It's highly recommended to use a multiple of 2 for the buffer size.

### format

`enum` `default: Float32`

The `format` property specifies the audio format in which Amplitude will send the audio data to the output device. It can take as value the name of the audio format or the audio format ID:

| ID  | Name    | Description                                                                          |
| --- | ------- | ------------------------------------------------------------------------------------ |
| 0   | Default | Uses the default format available on the audio device.                               |
| 1   | UInt8   | Process and send data as `unsigned 8-bit fixed-point numbers` to the audio device.   |
| 2   | Int16   | Process and send data as `signed 16-bit fixed-point numbers` to the audio device.    |
| 3   | Int24   | Process and send data as `signed 24-bit fixed-point numbers` to the audio device.    |
| 4   | Int32   | Process and send data as `signed 32-bit fixed-point numbers` to the audio device.    |
| 5   | Float32 | Process and send data as `signed 32-bit floating-point numbers` to the audio device. |

{{< alert context="info" >}}
Amplitude internally process audio data as 32-bit floating-point numbers. The `format` setting is used only when sending audio data to the driver. If the audio device is consuming a format different from the one set here, the role is to the driver to deal with the final format conversion. Most of the times, using `Default` is the best thing to do.
{{< /alert >}}

## mixer

`object` `required`

The `mixer` property configures the Amplitude Mixer (Amplimix). It takes as value an object with the following properties:

### active_channels

`uint` `required`

Specifies the maximum number of sound channels to render by Amplimix. It equals to the number of sounds playing simultaneously in the game. If the maximum number of channels is reached, Amplitude will prioritize the most important channels and virtualize the others.

### virtual_channels

`uint` `required`

Specifies the maximum number of virtual channels to use in addition to active channels. Amplimix doesn't render virtual channels, but all the information about them are still tracked.

### panning_mode

`enum` `default: Stereo`

The `panning_mode` attribute defines how Amplitude will render spatial sounds to speakers. It can take as value the name of the panning mode, or its ID. There are four (04) values available:

| ID  | Name                  | Description                                                                                                                                                                                                     |
| --- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | Stereo                | 2D stereo (left/right) panning. Spatialized sounds will be panned based on their horizontal (the XY plane) position in listener space.                                                                          |
| 1   | BinauralLowQuality    | HRTF based panning using first-order Ambisonics, over a virtual array of 8 loudspeakers arranged in a cube configuration around the listener.                                                                   |
| 2   | BinauralMediumQuality | HRTF based panning using second-order Ambisonics, over a virtual array of 12 loudspeakers arranged in a dodecahedral configuration (using faces of the dodecahedron).                                           |
| 3   | BinauralHighQuality   | HRTF based panning using third-order Ambisonics, over a virtual array of 26 loudspeakers arranged in a [Lebedev grid](https://people.sc.fsu.edu/~jburkardt/m_src/sphere_lebedev_rule/sphere_lebedev_rule.html). |

### pipeline

`string` `required`

The property is used to set the name of the pipeline asset Amplimix will use. You should give the name of the binary pipeline asset (`.ampipeline`), with its extension. Amplitude will look up the asset in the appropriate directory.

## game

`object` `required`

This setting is used by Amplitude to understand how it should synchronize with the game, how to handle game and sound objects, and how to render sounds in the game environment. This is achieved by specifying a set of inner values in this setting.

### listener_fetch_mode

`enum` `default: Nearest`

Since Amplitude allows you to define many listeners at the same time, but only one can render data for a single sound object, this setting is used to define how the engine will pick the right listener for each rendered sound object. Available values are:

| ID  | Name     | Description                                                                                     |
| --- | -------- | ----------------------------------------------------------------------------------------------- |
| 0   | None     | Do not fetch for listeners. This mute all spatialized sound sources, but keeps processing data. |
| 1   | Nearest  | Fetches for the nearest listener to the currently processed sound source.                       |
| 2   | Farthest | Fetches for the farthest listener to the currently processed sound source.                      |
| 3   | Default  | Always use the default listener set in the engine at runtime for every sound source.            |
| 4   | First    | Always use the first available listener of the list for every sound source.                     |
| 5   | Last     | Always use the last available listener of the list for every sound source.                      |

By using `Nearest` or `Farthest`, different listeners may be used at the same time for each sound source. Using `Default`, `First`, or `Last` may ensure that the same listener is used for every sound sources.

### listeners

`uint` `default: 1`

The `listeners` property specifies the maximum number of listeners to pre-allocate. You will not be able to create more [Listener] objects than this value at runtime.

### entities

`uint` `default: 4096`

The `entities` property specifies the maximum number of game entities to pre-allocate. This value does not represent all the entities of your game or scene but only the approximate number of entities managed by the Amplitude Engine. You will not be able to create more [Entity] objects than that value at runtime.

### environments

`uint` `default: 64`

The `environments` property specifies the maximum number of sound environments to pre-allocate. Sound environments are spaces in the 3D environment of the game where Amplitude may process specific effects and attenuation models. You will not be able to create more [Environment] objects than that value at runtime.

### rooms

`uint` `default: 1024`

The `rooms` property specifies the maximum number of rooms to pre-allocate. Rooms are used to simulate sound reflections and reverberation in closed spaces. You will not be able to create more [Room] objects than that value at runtime.

### sound_speed

`float` `default: 343.0`

This property sets the speed of sound (in meters per second) in the game. This value will be used by the engine to process some effects like the [Doppler effect](https://en.wikipedia.org/wiki/Doppler_effect). If the value is not defined, it will default to `343.0`, which is the approximated value of the real speed of sound in air.

### doppler_factor

`float` `default: 1.0`

This property takes a float value greater or equal to `0.0`. It will affect how much power is given to the Doppler effect. A value of `0.0` will disable the Doppler effect, while a value of `1.0` will render it as it should. Any other value will affect the effect's pitch.

### obstruction

`object` `required`

The `obstruction` property lets you set up the way Amplitude will compute sound obstruction in the game. It takes as value an object with the following properties:

- **lpf_curve**: Set the Low-Pass Filter [curve]({{< relref "99-api" >}}#curve-definition) for the obstruction sound processor.
- **gain_curve**: Set the gain [curve]({{< relref "99-api" >}}#curve-definition) for the obstruction sound processor.

### occlusion

`object` `required`

The `occlusion` property works the same as the `obstruction` property, but it's used instead to instruct Amplitude on how to process sound occlusion in the game.

### track_environments

`boolean` `default: true`

Defines whether the game is tracking environments. This means that the game will compute and send the environment amounts to the engine. This implies that the shapes defined in environments (if any) will not be used.

Setting this value to `false` will instruct Amplitude to track environment amounts by himself. This way, Amplitude will use environment shapes and sound positions to compute the environment amounts.

## buses_file

`string` `required`

The `buses_file` property defines the path to the binary (`.ambus`) file that contains the buses definitions. Only one bus file can be loaded per engine configuration.

## driver

`string` `required`

The `driver` property indicates the name of the audio [Driver] implementation to use for communication with the physical audio device. You can implement multiple audio drivers as needed and register them in the engine with the plugin API.

## Example

The following example describes an engine configuration file:

```json {title="pc.config.json"}
{
  "output": {
    "frequency": 44100,
    "buffer_size": 4096,
    "format": "Float32"
  },
  "mixer": {
    "panning_mode": "BinauralHighQuality",
    "active_channels": 50,
    "virtual_channels": 100,
    "pipeline": "default.ampipeline"
  },
  "game": {
    "listener_fetch_mode": "Nearest",
    "track_environments": true,
    "listeners": 100,
    "entities": 4096,
    "environments": 512,
    "rooms": 1024,
    "sound_speed": 333,
    "doppler_factor": 1.0,
    "obstruction": {
      "lpf_curve": {
        "parts": [
          {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 1,
              "y": 1
            },
            "fader": "Linear"
          }
        ]
      },
      "gain_curve": {
        "parts": [
          {
            "start": {
              "x": 0,
              "y": 1
            },
            "end": {
              "x": 1,
              "y": 1
            },
            "fader": "Linear"
          }
        ]
      }
    },
    "occlusion": {
      "lpf_curve": {
        "parts": [
          {
            "start": {
              "x": 0,
              "y": 0
            },
            "end": {
              "x": 1,
              "y": 1
            },
            "fader": "Linear"
          }
        ]
      },
      "gain_curve": {
        "parts": [
          {
            "start": {
              "x": 0,
              "y": 1
            },
            "end": {
              "x": 1,
              "y": 0
            },
            "fader": "Linear"
          }
        ]
      }
    }
  },
  "buses_file": "pc.buses.ambus",
  "driver": "miniaudio",
}
```
