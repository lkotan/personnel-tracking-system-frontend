<template>
<div>
   <v-autocomplete
    :value="Id"
    :search-input.sync="searchWatch"
    :items="items"
    :item-value="itemValue"
    :item-text="itemText"
    :loading="isLoading"
    label="Personeller"
    dense
    outlined
    placeholder="Ara"
    @input="$emit('input', $event)"
    :rules="isRequired ? validataion.required :[]"
  ></v-autocomplete>
</div>
</template>

<script>
import { inputValidation } from "@/helpers/vuetify";

export default {
  props: {
    isRequired:{
      type:Boolean,
      default:false,
      required:false,
    },
    Id: {
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    itemValue: {
      type: String,
      required: true,
    },
    itemText: {
      type: String,
      required: true,
    },
    isLoading:{
      type:Boolean,
      required:true
    }
  },
  data() {
    return {
      searchWatch: "",
      validataion:inputValidation
    };
  },
  watch: {
    searchWatch(value) {
      if (value == null) return;

      this.$emit("searchValue", value);
    },
  },
};
</script>

<style>
</style>