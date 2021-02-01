<template>
  <section class="w-100">
    <div class="card">
      <div class="card-header d-flex justify-content-between">
        <h4 class="d-flex align-items-center m-0">Görevler</h4>
        <v-col class="ml-auto py-0" cols="12" md="3">
          <v-text-field
            class="p-0 m-0"
            :value="keyword"
            append-icon="mdi-magnify"
            label="Ara:"
            hide-details
            :loading="loading"
            @input="searchAssigments($event)"
          ></v-text-field>
        </v-col>
        <div
          class="d-flex flex-row flex-wrap justify-content-center justify-content-sm-end table-action-buttons"
        >
          <AssigmentModal v-if="ruleControlInsert(3)" :createModal="true" />

          <button
            v-if="$auth.user.personnelType==20"
            class="btn font-weight-medium position-relative btn btn-inverse-danger ml-2 d-flex"
            type="button"
            @click="deleteRange"
          >
            <i class="ti-trash mr-2"></i>
            <p class="mb-0">Sil</p>
            <b-icon
              font-scale="2"
              style="position: absolute; right: 0.5rem;"
            ></b-icon>
          </button>
        </div>
      </div>

      <v-row class="mr-3 mt-3">
        <v-col class="d-flex ml-auto pb-0 mt-2" cols="12" md="3">
          <v-select
            @change="filterAssigments($event)"
            :items="status"
            label="Duruma Göre Filtrele"
            item-value="id"
            :value="statusId"
            item-text="description"
            placeholder="Duruma Göre Filtrele"
            dense
            outlined
          ></v-select>
        </v-col>

        <v-col class="d-flex pb-0 mt-2" cols="12" md="3">
          <v-select
            @change="filterPersonnels($event)"
            :items="personnels"
            label="Personele Göre Filtrele"
            :value="personnelId"
            item-value="id"
            item-text="description"
            placeholder="Personele Göre Filtrele"
            dense
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-data-table
        :no-results-text="noResultText(search)"
        :search="search"
        v-model="selected"
        :headers="headers"
        :items="entities"
        item-key="id"
        :show-select="$auth.user.personnelType==20 ? true : false"
        :footer-props="{ 'items-per-page-text': 'Listelenecek :' }"
      >
        <template v-slot:item.profilePhoto="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <span v-bind="attrs" v-on="on">
                <v-avatar size="40">
                  <v-img
                    :src="personnelPhoto(item.personnelInfo.profilePhoto)"
                  ></v-img>
                </v-avatar>
              </span>
            </template>
            <span
              >{{ item.personnelInfo.firstName }}
              {{ item.personnelInfo.lastName }}</span
            >
          </v-tooltip>
        </template>
        <template v-slot:item.title="{ item }">
          {{ item.title }}
        </template>
        <template v-slot:item.priority="{ item }">
          <v-rating
            :readonly="$auth.user.personnelId != item.personnelInfo.id"
            class="rating"
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
            small
          ></v-rating>
        </template>
        <template v-slot:item.status="{ item }">
          <v-chip dark :color="statusColor(item.statusName)" small>
            {{ item.statusName }}
          </v-chip>
        </template>
        <template v-slot:item.dueDate="{ item }">
          {{ formatDate(item.dueDate, 'DD-MM-YYYY') }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu
            :absolute="false"
            :open-on-hover="false"
            :close-on-click="true"
            :close-on-content-click="true"
            :offset-x="false"
            :offset-y="true"
            transition="slide-x-transition"
          >
            <template
              v-slot:activator="{ on, attrs }"
              v-if="currentPersonnel(item.personnelInfo.id)"
            >
              <v-btn dark icon v-bind="attrs" v-on="on" color="primary">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>

            <template v-else v-slot:activator="{ on, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" color="red">
                    mdi-cancel</v-icon
                  >
                </template>
                <span>Yetkiniz Yok!</span>
              </v-tooltip>
            </template>

            <v-list class="btn-dropdown-list">
              <AssigmentModal
                v-if="ruleControlInsert(3)"
                :editModal="true"
                :assigmentId="item.id"
              />

              <v-list-item @click="remove(item.id)" v-if="ruleControlDelete(3)">
                <v-list-item-title>
                  <v-icon class="mr-2">ti-trash</v-icon>Sil
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  tableOptions,
  confirmOption,
  toastOption
} from '@/helpers/plugin-options'
import { inputValidation } from '@/helpers/vuetify'
import ModalBtnDropdown from '@/components/shared/modal-dropdown/btn-dropdown'
import AssigmentModal from '@/components/shared/assigment-modal'

export default {
  middleware: 'auth-user',
  head() {
    return { title: `Personel Görevleri ${process.env.title}` }
  },
  components: {
    ModalBtnDropdown,
    AssigmentModal
  },
  data() {
    return {
      ...tableOptions.defaultData,
      headers: [
        { text: '', value: 'profilePhoto', width: 50 },
        { text: 'Görev Adı', value: 'title' },
        { text: 'Durum', value: 'status', width: 130 },
        { text: 'Öncelik', value: 'priority', width: 120, align: 'center' },
        { text: 'Bitiş', value: 'dueDate', width: 120 },
        tableOptions.actionColumn
      ],
      loading: false
    }
  },
  async asyncData(state) {
    await state.store.dispatch('assigments/getAll')
    await state.store.dispatch('personnels/getSelectList')
    await state.store.dispatch('assigments/getStatuses')
  },
  computed: {
    ...mapGetters({
      entities: 'assigments/getAll',
      personnels: 'personnels/getSelectList',
      status: 'assigments/getStatuses',
      statusId: 'assigments/getStatusId',
      personnelId: 'assigments/getPersonnelId',
      keyword: 'assigments/getKeyword'
    }),
    currentPersonnel: function(personnelId) {
      return personnelId => {
        if (this.$auth.user.personnelType == 20) return true
        if (this.$auth.user.personnelId == personnelId) return true
        return false
      }
    }
  },
  methods: {
    async remove(id) {
     await this.deleteAction("assigments",id)
    },
    async searchAssigments(value) {
      var self = this
      this.delay(async function() {
        self.loading = true
        if (value.length <= 2) {
          self.$store.commit('assigments/addKeyword', '')
          await self.$store.dispatch('assigments/getAll')
          self.loading = false
          return
        }
        self.$store.commit('assigments/addKeyword', value)
        await self.$store.dispatch('assigments/getAll')
        self.loading = false
      }, 1000)
    },
    async filterAssigments(statusId) {
      this.$store.commit('assigments/addStatusId', statusId)
      await this.$store.dispatch('assigments/getAll')
    },
    async filterPersonnels(personnelId) {
      this.$store.commit('assigments/addPersonnelId', personnelId)
      await this.$store.dispatch('assigments/getAll')
    },
    async changePriority(assigmentId, priority) {
      const res = await this.$store.dispatch('assigments/changePriority', {
        assigmentId: assigmentId,
        priority: priority
      })
      this.$toast.show(res.message,!res.success ? toastOption.error : toastOption.success)
    },
    async deleteRange() {
      const list = this.selected.select('id')
      await this.deleteRangeAction('assigments', list)
    },
    statusColor(status) {
      switch (status) {
        case 'Tamamlandı':
          return 'red'
        case 'Yeni Görev':
          return 'green'
        case 'Devam Ediyor':
          return 'primary'
        default:
          return 'black'
      }
    }
  }
}
</script>

<style>
.text-start
  .v-btn.v-btn--disabled.v-btn--icon.v-btn--round.theme--dark.v-size--default {
  color: #b5aaaa !important;
}
header.v-sheet.theme--dark.v-toolbar.v-toolbar--flat.assigment-title {
  height: 44px !important;
}
</style>
