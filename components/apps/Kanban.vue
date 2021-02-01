<template>
  <div class="drag-container">
    <ul class="drag-list">
      <li
        v-for="stage in stages"
        class="drag-column board-portlet"
        :class="{ ['drag-column-' + stage]: true }"
        :key="stage"
      >
        <span class="drag-column-header">
          <slot :name="stage">
            <h2>{{ stage }}</h2>
          </slot>
        </span>
        <div class="drag-options"></div>
        <ul
          class="drag-inner-list portlet-card-list my-assigment-inner-list"
          ref="list"
          :data-status="stage"
        >
          <li
            style="heigth:140px"
            class="drag-item portlet-card"
            v-for="block in getBlocks(stage)"
            :data-block-id="block.id"
            :key="block.id"
          >
            <slot :name="block.id">
              <strong>{{ block.status }} </strong>
              <div>{{ block.id }}</div>
            </slot>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import dragula from "dragula"

export default {
  name: 'KanbanBoard',
  props: {
    stages: {},
    blocks: {},
  },
  data() {
    return {
    };
  },
  computed: {
    localBlocks() {
      return this.blocks;
    },
  },
  methods: {
    getBlocks(status) {
     return this.localBlocks.filter((block) => block.statusName === status);
    },
  },
  updated() {
    this.drake.containers = this.$refs.list;
  },
  mounted() {
    this.drake = dragula(this.$refs.list)
      .on('drag', (el) => {
        el.classList.add('is-moving');
      })
      .on('drop', (block, list) => {
        // let index = 0;
        // let displayOrderList = [];
        // for (let q = 0; q < list.children.length; q += 1) {
        //   list.children[q].dataset.displayOrder = q;
        //   if (list.children[q].classList.contains('is-moving')) index = q;
        //   displayOrderList.push({
        //     id: list.children[q].dataset.blockId.toInt(),
        //     displayOrder: q,
        //   });
        // }
        this.$emit(
          'update',
          block.dataset.blockId,
          list.dataset.status,
        );
      })
      .on('dragend', (el) => {
        el.classList.remove('is-moving');
        window.setTimeout(() => {
          el.classList.add('is-moved');
          window.setTimeout(() => {
            el.classList.remove('is-moved');
          }, 600);
        }, 100);
      });
  },
};
</script>

<style>
.my-assigment-inner-list {
  min-height: 50px !important;
}
</style>
