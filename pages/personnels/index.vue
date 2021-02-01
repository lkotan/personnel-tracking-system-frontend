<template>
  <section class="w-100 personnel-list">
    <div class="card">
      <TableHeader
        header="Personeller"
        @create="create"
        @deleteRange="deleteRange"
        @search="key => (search = key)"
        :ruleModule="1"
      />
      <div class="card-body p-0">
        <v-data-table
          :no-results-text="noResultText(search)"
          :search="search"
          v-model="selected"
          :headers="
            ruleControlUpdate(1) && $auth.user.personnelType==20
              ? headers
              : headers.filter(x => x.value != 'isBlocked')
          "
          :items="entities"
          item-key="id"
          show-select
          :items-per-page="-1"
          :hide-default-footer="true"
        >
          <template v-slot:item.profilePhoto="{ item }">
            <v-avatar>
              <v-img
                size="40"
                :src="personnelPhoto(item.personnelInfo.profilePhoto)"
              ></v-img>
            </v-avatar>
          </template>
          <template v-slot:item.isBlocked="{ item }">
            <v-switch
              :input-value="item.isBlocked"
              @change="isBlockedChange(item.id)"
              color="red"
              hide-details
              class="mt-0"
            />
          </template>

          <template v-slot:item.firstName="{ item }">
            <div>
              <span
                >{{ item.personnelInfo.firstName }}
                {{ item.personnelInfo.lastName }}</span
              >
            </div>
            <strong style="color:#6592d9;">{{ item.department }}</strong>
          </template>

          <template v-slot:item.gsm="{ item }">
            <span v-if="item.gsm == ''">0000-000-0000</span>
            <span v-else>{{ item.gsm }}</span>
          </template>

          <template
            v-if="$auth.user.personnelType != 20"
            v-slot:item.actions="{ item }"
          >
            <v-list-item
              @click="edit(item.id)"
              v-if="$auth.user.personnelId == item.id"
            >
              <v-list-item-title>
                <v-icon style="font-size:20px;" class="mr-2"
                  >ti-pencil-alt</v-icon
                >
              </v-list-item-title>
            </v-list-item>
          </template>

          <template v-else v-slot:item.actions="{ item }">
            <ModalBtnDropdown :id="item.id" @edit="edit(item.id)" />
          </template>
        </v-data-table>
      </div>
    </div>

    <!--INSERT MODAL-->
    <v-dialog v-model="dialog" persistent max-width="650px">
      <v-card>
        <ModalDetailHeader header="Yeni Personel" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entity.firstName"
                  :rules="validation.required"
                  label="Adı"
                  placeholder="Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entity.lastName"
                  :rules="validation.required"
                  label="Soyadı"
                  placeholder="Soyadı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entity.email"
                  :rules="validation.email"
                  label="Email"
                  placeholder="Email"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entity.gsm"
                  :rules="validation.phone"
                  label="Gsm"
                  placeholder="Gsm"
                  dense
                  outlined
                  v-mask="'(####)-###-####'"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-select
                  v-model="entity.titleId"
                  :items="titles"
                  item-value="id"
                  item-text="description"
                  label="Ünvan Seçiniz"
                  placeholder="Ünvan Seçiniz"
                  dense
                  outlined
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="entity.departmentId"
                  :items="departments"
                  item-value="id"
                  item-text="description"
                  label="Departman Seçiniz"
                  placeholder="Departman Seçiniz"
                  dense
                  outlined
                />
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-select
                  v-model="entity.roleId"
                  :items="roles"
                  item-value="id"
                  item-text="description"
                  label="Yetki Seçiniz"
                  placeholder="Yetki Seçiniz"
                  dense
                  outlined
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="entity.personnelType"
                  :items="personnelTypes"
                  item-value="id"
                  item-text="description"
                  label="Personel Tipi Seçiniz"
                  placeholder="Personel Tipi Seçiniz"
                  dense
                  outlined
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
      :max-width="customModalMaxWidth(loading)"
    >
      <Loading v-if="loading" />
      <v-card v-else>
        <ModalDetailHeader header="Personnel Düzenle" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="updateEntity.firstName"
                  :rules="validation.required"
                  label="Adı"
                  placeholder="Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="updateEntity.lastName"
                  :rules="validation.required"
                  label="Soyadı"
                  placeholder="Soyadı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="updateEntity.email"
                  :rules="validation.email"
                  label="Email"
                  placeholder="Email"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="updateEntity.gsm"
                  :rules="validation.phone"
                  label="Gsm"
                  placeholder="Gsm"
                  dense
                  outlined
                  v-mask="'(####)-###-####'"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal" v-if="this.$auth.user.personnelType == 20">
              <v-col cols="12" md="6">
                <v-select
                  v-model="updateEntity.titleId"
                  :items="titles"
                  item-value="id"
                  item-text="description"
                  label="Ünvan Seçiniz"
                  placeholder="Ünvan Seçiniz"
                  dense
                  outlined
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="updateEntity.departmentId"
                  :items="departments"
                  item-value="id"
                  item-text="description"
                  label="Departman Seçiniz"
                  placeholder="Departman Seçiniz"
                  dense
                  outlined
                />
              </v-col>
            </v-row>
            <v-row class="row-modal" v-if="this.$auth.user.personnelType == 20">
              <v-col cols="12" md="6">
                <v-select
                  v-model="updateEntity.roleId"
                  :items="roles"
                  item-value="id"
                  item-text="description"
                  label="Yetki Seçiniz"
                  placeholder="Yetki Seçiniz"
                  dense
                  outlined
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="updateEntity.personnelType"
                  :items="personnelTypes"
                  item-value="id"
                  item-text="description"
                  label="Personel Tipi Seçiniz"
                  placeholder="Personel Tipi Seçiniz"
                  dense
                  outlined
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

export default {
  middleware: 'auth-user',
  head() {
    return { title: `Personeller ${process.env.title}` }
  },
  components: {
    TableHeader,
    ModalBtnDropdown,
    ModalDetailHeader,
    ModalDetailFooter,
    Loading
  },
  data() {
    return {
      ...tableOptions.defaultData,
      headers: [
        { text: '', value: 'profilePhoto', width: 50 },
        { text: 'Adı Soyadı', value: 'firstName' },
        { text: 'Email', value: 'email', width: 100 },
        { text: 'Gsm', value: 'gsm', width: 100 },
        tableOptions.isBlockedColumn,
        tableOptions.actionColumn
      ],
      valid: true,
      loading: false,
      validation: inputValidation,
      dialog: false,
      dialogUpdate: false,
      entity: {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        gsm: '',
        titleId: null,
        departmentId: null,
        roleId: null,
        isBlocked: false,
        personnelType: 1
      },
      updateEntity: {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        gsm: '',
        titleId: null,
        departmentId: null,
        roleId: null,
        isBlocked: false,
        personnelType: 1
      }
    }
  },
  async asyncData(state) {
    await state.store.dispatch('personnels/getAll')
  },
  computed: {
    ...mapGetters({
      entities: 'personnels/getAll',
      personnelTypes: 'personnels/getPersonnelTypes',
      titles: 'titles/getSelectList',
      departments: 'departments/getSelectList',
      roles: 'roles/getAll'
    })
  },
  methods: {
    clearInput() {
      this.entity = {
        id: 0,
        firstName: '',
        lastName: '',
        email: '',
        gsm: '',
        titleId: null,
        departmentId: null,
        roleId: null,
        isBlocked: false,
        personnelType: 1
      }
    },
    async create() {
      this.clearInput()
      await Promise.all([
        this.$store.dispatch('titles/getSelectList'),
        this.$store.dispatch('departments/getSelectList'),
        this.$store.dispatch('roles/getAll'),
        this.$store.dispatch('personnels/getPersonnelTypes')
      ])
      this.dialog = true
    },
    async Insert() {
      if (!this.$refs.form.validate()) return
      let model = { ...this.entity }
      model.gsm = model.gsm.clearPhone()
      await this.insertAction('personnels', model)
      await this.$store.dispatch('personnels/getAll')
      this.dialog = false
    },
    async Update() {
      if (!this.$refs.form.validate()) return
      let model = { ...this.updateEntity }
      model.gsm = model.gsm.clearPhone()
      await this.updateAction('personnels', model)
      await this.$store.dispatch('personnels/getAll')
      this.dialogUpdate = false
    },
    async edit(id) {
      this.loading = true
      this.dialogUpdate = true
      this.updateEntity = await this.$PersonnelService.Get(id)
      if (this.$auth.user.personnelType == 20) {
        await Promise.all([
          this.$store.dispatch('titles/getSelectList'),
          this.$store.dispatch('departments/getSelectList'),
          this.$store.dispatch('roles/getAll'),
          this.$store.dispatch('personnels/getPersonnelTypes')
        ])
      }

      this.loading = false
    },
    async deleteRange() {
      const list = this.selected.select('id')
      await this.deleteRangeAction('personnels', list)
    },
    async isBlockedChange(id) {
      await this.isBlockedChangeAction('personnels', id)
    }
  }
}
</script>

<style>
.personnel-list .v-data-table__wrapper tbody tr {
  height: 65px;
}
</style>
