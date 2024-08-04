
[中文](./README.md) |-> [English](./README.en.md)


### 🍴 Fork

This is a fork of the  [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless) repository, And it is a fork of the [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) repository.

# ⚗️ Background

The [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) has been a long time not updated, The key is in ` PicGo ` underlying upload library from ` request ` migrated to ` axios `, reference [PicGo/PicGo-Core#65](https://github.com/PicGo/PicGo-Core/issues/65), led to [TinyPng](https://tinypng.com/) is unavailable. Seems to be the last available version is [PicGo v2.3.0](https://github.com/Molunerfinn/PicGo/releases/tag/v2.3.0).  

Fortunately I found the [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless), But its only upload [v1.0.1](https://www.npmjs.com/package/picgo-plugin-compress-webp-lossless). Its implementation is still through older versions of the [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress). However, the code updates the ` v1.1.0 `, but after refactoring with 'ES' it is not compatible with 'PicGo', and there are still some problems.

So there is ***`picgo-plugin-compress-next`*** birth 🎉

# 💥 Comparison

<table border=2 style="
  width: auto;
  display: table;
  margin-left: auto;
  margin-right: auto;"
>
  <tr>
    <th></th>
    <th colspan=2>compress-next</th>
    <th colspan=2>compress</th>
  </tr>
  <tr>
    <th rowspan=5>TinyPng</th>
    <td>✅</td>
    <td>version >= <b>2.3.1</b></td>
    <td>❌</td>
    <td>Highest version <b>2.3.0</b></td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      Multiple keys are used in combination<br>
      Use commas to separate and automatically clear whitespace
    </td>
    <td>✅</td>
    <td>
      Multiple keys are used in combination<br>
      Strictly use commas, no whitespace
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      TinyPngWeb is deprecated<br>
      Throws an exception and prompts you to configure the Key
    </td>
    <td>❌</td>
    <td>
      TinyPngWeb is unavailable<br>
      Throwing a blank exception can only view logs<br>
      Page returns <b>404</b> or <b>413</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      <b>automatically skips</b> when an invalid Key appears<br>
      Tags are no longer accessed unless manually refreshed
      </td>
    <td>❌</td>
    <td>
      An invalid Key occurs, throwing a blank exception<br>
      View log, page return <b>404</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      Supports manual refreshing of <b>Valid</b> Keys<br>
      Supports manual refreshing of <b>all</b> Keys<br>
      Can be set to <b>automatically</b> refresh Key if across months
    </td>
    <td>❌</td>
    <td>
      If the valid Key reaches the number of times used, no access <br>
      The configuration file can be reset only after it is deleted
    </td>
  </tr>
  <tr>
    <th rowspan=1>imagemin</th>
    <td>✅</td>
    <td>Support for local lossy conversion</td>
    <td>✅</td>
    <td>Support for local lossy conversion</td>
  </tr>
  <tr>
    <th rowspan=2>imagemin2webp</th>
    <td>✅</td>
    <td>Support for local lossy conversion</td>
    <td>✅</td>
    <td>Support for local lossy conversion</td>
  </tr>
  <tr>
    <td>✅</td>
    <td>Support gif to webp</td>
    <td>❌</td>
    <td>Conversion from gif to webp is not supported</td>
  </tr>
  <tr>
    <th rowspan=1>webp-converter</th>
    <td>✅</td>
    <td>
      jpeg, png, webp compressed to webp<br>
      Support gif compression to webp
    </td>
    <td>❌</td>
    <td>Cannot use webp-converter</td>
  </tr>
  <!-- <tr>
    <td>✅</td>
    <td></td>
    <td>❌</td>
    <td></td>
  </tr> -->
</table>


# 🎉 Function

- [x] Multiple keys can be used in combination
- [x] supports TinyPng compression for `PicGo >= v2.3.1`
- [x] disables `TinyPngWeb` and throws an exception
- [x] Handle error `Key` and skip
- [x] Handling refresh of `Key`
  - [x] Refreshing of `valid keys`
  - [x] Refreshing of `all keys`
  - [x] `Automatically` refresh `valid keys` if across months
- [x] add `webp-converter` (Smaller volume and Higher speed)
- [ ] Add ability of `gift 2 webp`  (imagemin2webp & webp-converter) (under test)


# Reporting Issues  

[You can click here directly to create an issue](https://github.com/supine0703/picgo-plugin-compress-next/issues/new)



<!-- # Picgo Plugin Compress Webp Lossless

The original project has been inactive for quite some time. It's intended to provide continued maintenance and support.

This project is a plugin for [PicGo](https://github.com/Molunerfinn/PicGo) and [PicGo-Core](https://github.com/PicGo/PicGo-Core), enabling image compression using the remote service provided by [TinyPNG](https://tinypng.com/) or local compression using [imagemin](https://github.com/imagemin/imagemin).

Additionally, it supports lossless converting images to the WebP format.

Several enhancements and updates have been implemented in this fork:

- **Dependency Upgrades**: The project dependencies have been updated to their latest versions, ensuring better compression efficiency.
- **Syntax Upgrade**: The codebase has been migrated to use ES modules, providing better compatibility with modern JavaScript ecosystems.
- **Lossless Compression**: Local image compression has been improved to offer lossless compression, resulting in better compression quality.

Feel free to contribute to this project or report any issues you encounter. Your feedback and contributions are greatly appreciated! -->
