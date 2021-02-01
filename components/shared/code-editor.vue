<template>
  <div class="w-100 d-flex flex-column">
    <v-toolbar dark flat>
      <v-toolbar-title>Kod Görünümü</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="preview = true">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </v-toolbar>
    <prism-editor
      class="my-editor"
      v-model="code"
      :code="code"
      :highlight="highlighter"
      line-numbers
      @input="changeCode"
    ></prism-editor>
    <v-dialog v-model="preview" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar dark flat>
          <v-btn icon dark @click="preview = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Ön İzleme</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <div class="d-flex flex-wrap w-100 h-100">
          <div class="editor-view mx-auto">
            <div v-html="code"></div>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";

export default {
  components: {
    PrismEditor,
  },
  props: ["value"],
  data: () => ({
    code: "",
    preview: false,
  }),
  methods: {
    highlighter(code) {
      console.log(languages);
      return highlight(code, languages.html);
    },
    changeCode() {
      console.log(this.code);
      this.$emit("input", this.code);
    },
  },
  created() {
    this.code = unescape(this.value);
    if (this.code == "") {
      this.code = `<!DOCTYPE html>
<html>
    <!-- KODUNUZU EDİTÖRE YAPIŞTIRIN -->
  
  
    <!-- KODUNUZU EDİTÖRE YAPIŞTIRIN -->
</html>`;
    }
  },
};
</script>
<style>
.my-editor {
  background: #2d2d2d;
  height: 350px;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 14px;
  line-height: 1.5;
  padding: 5px;
  overflow: auto;
}
.editor-view {
  height: 100%;
  overflow: auto;
}
.prism-editor__textarea:focus {
  outline: none;
}
pre.prism-editor__editor {
  color: #fff;
}

</style>