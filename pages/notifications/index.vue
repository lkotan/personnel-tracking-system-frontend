<template>
  <section class="w-100">
    <div class="card">
      <TableHeader
        header="Bildirimler"
        @create="create"
        @deleteRange="deleteRange"
        @search="key => (search = key)"
        :ruleModule="8"
      />
      <div class="card-body p-0">
        <v-data-table
          :no-results-text="noResultText(search)"
          :search="search"
          v-model="selected"
          :headers="
            ruleControlUpdate(8)
              ? headers
              : headers.filter(x => x.value != 'actions')
          "
          :items="entities"
          item-key="id"
          :show-select="$auth.user.personnelType == 20 ? true : false"
          :items-per-page="-1"
          :hide-default-footer="true"
        >
          <template v-slot:item.firstName="{ item }">
            <span v-if="item.personnelId != null">
              {{ item.personnelInfo.firstName }}
              {{ item.personnelInfo.lastName }}
            </span>

            <v-chip
              color="rgb(234, 51, 51)"
              class="text-white"
              small
              v-else
              small
            >
              Genel
            </v-chip>
          </template>

          <template v-slot:item.assigmentId="{ item }">
            <v-tooltip bottom v-if="item.assigmentId != null">
              <template v-slot:activator="{ on, attrs }">
                <v-chip
                  color="#4214a8"
                  class="text-white"
                  small
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ item.assigmentId }}
                </v-chip>
              </template>
              <span>{{ item.assigmentTitle }}</span>
            </v-tooltip>

            <v-chip
              color="rgb(234, 51, 51)"
              class="text-white"
              small
              v-else
              small
            >
              Genel
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <ModalBtnDropdown :id="item.id" @edit="edit(item.id)" />
          </template>
        </v-data-table>
      </div>
    </div>

    <!--INSERT MODAL-->
    <v-dialog v-model="dialog" persistent max-width="450px">
      <v-card>
        <ModalDetailHeader header="Yeni Bildirim" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="12" class="row-modal">
                <v-text-field
                  v-model="entity.title"
                  :rules="validation.required"
                  label="Başlık"
                  placeholder="Başlık"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="entity.message"
                  :rules="validation.required"
                  label="Mesaj"
                  placeholder="Mesaj"
                  dense
                  outlined
                  rows="3"
                  counter
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="12">
                <AutoCompletePersonnels
                  :Id="entity.personnelId"
                  :isLoading="loadingSearch"
                  @searchValue="searchValuePersonnels($event)"
                  @input="selectPersonnel($event)"
                  :items="searchPersonnels"
                  itemValue="id"
                  itemText="description"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <ModalDetailFooter @insert="Insert" @cancel="dialog = false" />
      </v-card>
    </v-dialog>

    <!--UPDATE MODAL-->
    <v-dialog
      v-model="dialogUpdate"
      persistent
      :max-width="customModalMaxWidth(loading, false, 450)"
    >
      <Loading v-if="loading" />
      <v-card v-else>
        <ModalDetailHeader header="Bildirim Düzenle" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="12" class="row-modal">
                <v-text-field
                  v-model="updateEntity.title"
                  :rules="validation.required"
                  label="Başlık"
                  placeholder="Başlık"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="12">
                <v-textarea
                  v-model="updateEntity.message"
                  :rules="validation.required"
                  label="Mesaj"
                  placeholder="Mesaj"
                  dense
                  outlined
                  rows="3"
                  counter
                  auto-grow
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="12">
                <AutoCompletePersonnels
                  :Id="updateEntity.personnelId"
                  :isLoading="loadingSearch"
                  @searchValue="searchValuePersonnels($event)"
                  @input="selectPersonnel($event)"
                  :items="searchPersonnels"
                  itemValue="id"
                  itemText="description"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <ModalDetailFooter
          :isUpdate="true"
          @update="Update"
          @cancel="dialogUpdate = false"
        />
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import { tableOptions, confirmOption } from '@/helpers/plugin-options'
import { inputValidation } from '@/helpers/vuetify'
import TableHeader from '@/components/shared/table/header'
import ModalBtnDropdown from '@/components/shared/modal-dropdown/btn-dropdown'
import ModalDetailHeader from '@/components/shared/modal-detail/header'
import ModalDetailFooter from '@/components/shared/modal-detail/footer'
import Loading from '@/components/shared/modal-loading'
import AutoCompletePersonnels from '@/components/shared/autoPersonnelComplete'

export default {
  middleware: 'auth-user',
  head() {
    return { title: `Bildirimler ${process.env.title}` }
  },
  components: {
    TableHeader,
    ModalBtnDropdown,
    ModalDetailHeader,
    ModalDetailFooter,
    Loading,
    AutoCompletePersonnels
  },
  data() {
    return {
      ...tableOptions.defaultData,
      headers: [
        { text: 'Başlık', value: 'title' },
        { text: 'Mesaj', value: 'message' },
        { text: 'Personel', value: 'firstName', width: 150 },
        { text: 'Görev', value: 'assigmentId', width: 100 },
        tableOptions.actionColumn
      ],
      valid: true,
      loading: false,
      validation: inputValidation,
      dialog: false,
      dialogUpdate: false,
      entity: {
        id: 0,
        title: '',
        message: '',
        personnelId: null,
        assigmentId: null
      },
      updateEntity: {
        id: 0,
        title: '',
        message: '',
        personnelId: null,
        assigmentId: null
      },
      searchPersonnels: [],
      loadingSearch: false
    }
  },
  async asyncData(state) {
    await state.store.dispatch('notifications/getAll')
  },
  computed: {
    ...mapGetters({
      entities: 'notifications/getAll',
      personnels: 'personnels/getSelectList'
    })
  },
  methods: {
    clearInput() {
      this.entity = {
        id: 0,
        title: '',
        message: '',
        personnelId: null
      }
    },
    selectPersonnel(id) {
      if (this.dialogUpdate) {
        this.updateEntity.personnelId = this.searchPersonnels.filter(
          x => x.id == id
        )[0].id
      } else {
        this.entity.personnelId = this.searchPersonnels.filter(
          x => x.id == id
        )[0].id
      }
    },
    async searchValuePersonnels(value) {
      var self = this
      this.delay(async function() {
        self.loadingSearch = true
        if (value.length <= 2) {
          self.searchPersonnels = []
          self.entity.personnelId = null
          self.updateEntity.personnelId = null
          self.loadingSearch = false
          return
        }
        self.searchPersonnels = await self.$PersonnelService.Search(value)
        self.loadingSearch = false
      }, 1000)
    },
    create() {
      this.clearInput()
      this.dialog = true
    },
    async Insert() {
      if (!this.$refs.form.validate()) return

      await this.insertAction('notifications', this.entity)
      await this.$store.dispatch('notifications/getAll')


      if (this.entity.personnelId == null) {
        this.$store.dispatch("personnelNotifications/getAllNotify")
      } 
      this.dialog = false
    },
    async edit(id) {
      await this.$store.dispatch('personnels/getSelectList')
      this.loading = true
      this.dialogUpdate = true
      this.updateEntity = await this.$NotificationService.Get(id)

      if (this.updateEntity.personnelId != null) {
        this.searchPersonnels = this.personnels.filter(
          x => x.id == this.updateEntity.personnelId
        )
      }
      this.loading = false
    },
    async Update() {
      if (!this.$refs.form.validate()) return
      await this.updateAction('notifications', this.updateEntity)
      await this.$store.dispatch('notifications/getAll')
      this.dialogUpdate = false
    },
    async deleteRange() {
      await this.deleteRangeAction('notifications', this.selected.select('id'))
    }
  }
}
</script>
