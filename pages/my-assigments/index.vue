<template>
  <section class="w-100">
    <div class="d-flex flex-column flex-md-row align-items-center">
      <h4 class="mb-md-0 mb-4 ml-5">Görevlerim</h4>
      <div
        class="wrapper ml-md-auto d-flex flex-column flex-md-row kanban-toolbar ml-n2 ml-md-0 mt-4 mt-md-0"
      >
      </div>
      <!--Insert Modal Assigment-->
      <AssigmentModal @Insert="Insert" :myCreateModal="true"/>
    </div>

    <!--Assigments-->
    <div class="board-wrapper pt-5">
      <client-only>
        <Kanban
          :stages="formatStatutes"
          :blocks="myAssigments"
          @update="updateTask"
        >
          <div v-for="stage in formatStatutes" :slot="stage" :key="stage">
            <h2>{{ stage }}</h2>
          </div>
          <div v-for="item in myAssigments" :slot="item.id" :key="item.id">
            <div>
              <div class="d-flex justify-content-between">
                <p class="task-date">
                  {{ formatDate(item.createdAt, 'DD.MM.YYYY') }}
                  <span
                    class="ml-1"
                    v-if="
                      item.createdUser !=
                        item.personnelInfo.firstName +
                          ' ' +
                          item.personnelInfo.lastName
                    "
                    :class="classObject(item.statusName)"
                    >{{ item.createdUser }}</span
                  >
                </p>

                <v-chip
                  v-if="item.tagInfo.name != null"
                  x-small
                  :color="item.tagInfo.tagBackgroundColor"
                  :text-color="item.tagInfo.tagColor"
                  class="px-2"
                >
                  <v-icon class="ml-auto mr-2" x-small
                    >mdi-checkbox-blank-circle</v-icon
                  >
                  {{ item.tagInfo.name }}
                </v-chip>
              </div>
              <p class="my-1 assigmentTitle">
                {{ item.title }}
              </p>
              <div class="d-lg-flex justify-content-between">
                <div class="d-flex">
                  <v-rating
                    class="rating mr-3"
                    :value="item.priority"
                    @input="changePriority(item.id, $event)"
                    background-color="black lighten-3"
                    :color="
                      item.priority <= 2
                        ? 'green'
                        : item.priority > 2 && item.priority < 5
                        ? 'blue'
                        : 'red'
                    "
                  ></v-rating>
                </div>
                <p class="due-date mt-1">
                  {{ formatDate(item.dueDate, 'DD.MM.YYYY') }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-for="stage in formatStatutes"
            :key="stage"
            :slot="`footer-${stage}`"
          ></div>
        </Kanban>
      </client-only>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { toastOption, confirmOption } from '@/helpers/plugin-options'
import { inputValidation } from '@/helpers/vuetify'
import AssigmentModal from '@/components/shared/assigment-modal'

export default {
  middleware: 'auth-user',
  head() {
    return { title: `Görevlerim ${process.env.title}` }
  },
  components: {
    Kanban: () => import('../../components/apps/Kanban'),
    AssigmentModal
  },
  async asyncData(state) {
    await state.store.dispatch('assigments/getAllMyAssigment')
    await state.store.dispatch('assigments/getStatuses')
  },
  computed: {
    ...mapGetters({
      myAssigments: 'assigments/getAllMyAssigment',
      statuses: 'assigments/getStatuses'
    }),
    formatStatutes() {
      return this.statuses.filter(x => x.id > 0).map(x => x.description)
    },
    classObject: function(status) {
      return status => {
        switch (status) {
          case 'Yeni Görev':
            return 'green--text text--lighten-2'
          case 'Devam Ediyor':
            return 'blue--text text--lighten-2'
          case 'Tamamlandı':
            return 'red--text text--lighten-2'
          default:
            return 'red--text text--lighten-2'
        }
      }
    }
  },
  methods: {
    Insert(){

    },
    async updateTask(id, status) {
      const myStatus = this.statuses.filter(x => x.description == status)
      const data = this.myAssigments.filter(x => x.id == id)

      const res = await this.$store.dispatch('assigments/changeMyStatus', {
        assigmentId: id,
        status: myStatus[0].id
      })
      if (!res.success)
        this.$confirm(confirmOption.error(response.message))
      else this.$toast.show(res.message,toastOption.success)
    },
    async changePriority(assigmentId, priority) {
     const res= await this.$store.dispatch("assigments/changeMyPriority", {
        assigmentId: assigmentId,
        priority: priority,
      });
      if (!res.success)
        this.$confirm(confirmOption.error(response.message))
      else this.$toast.show(res.message,toastOption.success)
    }
  }
}
</script>

<style>
.due-date {
  font-size: 12px;
}
.assigmentTitle {
  font-size: 12px;
  line-height: 1.4;
}
.assigment-item-chip {
  margin-top: 6px;
}
</style>
