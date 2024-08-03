
[中文](./README.md) <-| [English](./README.en.md)


### 🍴 分支

这是 [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless) 的一个分支，同时它又是 [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) 的分支


# ⚗️ 背景

[picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) 已经许久没有更新了，关键是在 `PicGo` 底层上传库从 `request` 迁移至 `axios` ，参考 [PicGo/PicGo-Core#65](https://github.com/PicGo/PicGo-Core/issues/65) ，导致 [TinyPng](https://tinypng.com/) 不可用。似乎最后一个可用版本是[PicGo v2.3.0](https://github.com/Molunerfinn/PicGo/releases/tag/v2.3.0)。  

幸运的是我发现了 [picgo-plugin-compress-webp-lossless](https://github.com/mrgeneralgoo/picgo-plugin-compress-webp-lossless) ，但是其只上传了 [v1.0.1](https://www.npmjs.com/package/picgo-plugin-compress-webp-lossless) ，其实现仍然是 [picgo-plugin-compress](https://github.com/JuZiSang/picgo-plugin-compress) 的旧实现，但是其代码更新到了 `v1.1.0` ，可惜的是使用 `ES` 重构后无法兼容 `PicGo` ，并且仍旧存在些许问题。  

于是便有了 ***`picgo-plugin-compress-next`*** 的诞生 🎉

# 💥 对比

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
    <td>最高 version <b>2.3.0</b></td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      多个 Key  叠加使用<br>
      使用逗号分隔，自动清除空白符
    </td>
    <td>✅</td>
    <td>
      多个 Key  叠加使用<br>
      严格使用逗号，不可有空白符
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      TinyPngWeb 已弃用<br>
      抛出异常并提示配置 Key 
    </td>
    <td>❌</td>
    <td>
      TinyPngWeb 已不可用<br>
      抛出空白异常 只能查看日志<br>
      网页返回 <b>404</b> 或则 <b>413</b> 
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      出现无效 Key，<b>自动跳过</b><br>
      标记并不再访问，除非手动刷新
      </td>
    <td>❌</td>
    <td>
      出现无效 Key，抛出空白异常<br>
      查看日志，网页返回 <b>404</b>
    </td>
  </tr>
  <tr>
    <td>✅</td>
    <td>
      支持手动刷新<b>有效</b> Key<br>
      支持手动刷新<b>所有</b> Key<br>
      可设置是否跨月份<b>自动</b>刷新 Key
    </td>
    <td>❌</td>
    <td>
      若有效 Key 达到使用次数，则不在访问<br>
      需要删除相应配置文件，才可重置
    </td>
  </tr>
  <!-- <tr>
    <td>✅</td>
    <td></td>
    <td>❌</td>
    <td></td>
  </tr> -->
</table>


# 🎉 功能

- [x] 支持多个 `Key` 叠加使用
- [x] 支持 `PicGo >= v2.3.1` 的 `TinyPng` 压缩
- [x] 禁用 `TinyPngWeb` 并抛出异常
- [x] 对错误的 `Key` 处理并跳过
- [x] 处理 `Key` 的刷新问题：
  - [x] 刷新有效 `Key`
  - [x] 刷新所有 `Key`
  - [x] 跨越份自动刷新有效 `Key`
- [ ] 加入 `webp-converter` (更小的体积)

# 报告问题

[你可以直接点击这里创建一个问题](https://github.com/supine0703/picgo-plugin-compress-next/issues/new)

