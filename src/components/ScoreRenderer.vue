<template>
  <div ref="songDiv"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import Abc2Svg from "../3rdparty/abc2svg-1";
const songDiv = ref<HTMLElement | null>(null);
const props = defineProps(['abc']);
let abcRenderer: any | undefined;
let div: HTMLElement | undefined;

onMounted(() => {
  if (songDiv.value === null) {
    return;
  }

  div = songDiv.value as HTMLElement;

  const rendererFunc = (txt: string) => (div as HTMLElement).innerHTML += txt;
  const errFunc = (err: string) => console.log({ err });

  abcRenderer = new (Abc2Svg.Abc as any)({
    img_out: rendererFunc,
    errmsg: errFunc
  });

  abcRenderer.tosvg('title', [
    "%%beginml",
    "<style>.underline{text-decoration:underline}</style>",
    "%%endml",
    "%%vocalfont  sans-serif 14",
    "%%setfont-1  sans-serif 14",
    "%%setfont-2  sans-serifItalic 14",
    "%%setfont-3  * * class=underline",
    "%%pagescale  1.3",
    "X:1",
    `${props.abc}`
].join("\n"));
});

</script>