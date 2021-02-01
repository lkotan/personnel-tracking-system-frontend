<template>
  <section class="w-100">
    <div class="card">
      <TableHeader
        header="Rol Tipleri"
        @create="create"
        @deleteRange="deleteRange"
        @search="(key) => (search = key)"
      />
      <div class="card-body p-0">
        <v-data-table
          :no-results-text="noResultText(search)"
          :search="search"
          v-model="selected"
          :headers="headers"
          :items="entities"
          item-key="id"
          show-select
          :items-per-page="-1"
          :hide-default-footer="true"
        >
          <template v-slot:item.isBlocked="{ item }">
            <v-switch
              :input-value="item.isBlocked"
              @change="isBlockedChange(item.id)"
              color="red"
              hide-details
              class="mt-0"
            />
          </template>

          <template v-slot:item.actions="{ item }">
            <ModalBtnDropdown :id="item.id" @edit="edit(item.id)" />
          </template>
        </v-data-table>
      </div>
    </div>
    <!--INSERT MODAL-->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <ModalDetailHeader header="Yeni Rol" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="6" class="row-modal">
                <v-text-field
                  v-model="entity.description"
                  :rules="validation.required"
                  label="Rol Adı"
                  placeholder="Rol Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="2">
                <v-switch
                  v-model="entity.isBlocked"
                  :label="entity.isBlocked ? 'Pasif' : 'Aktif'"
                  color="red"
                ></v-switch>
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
      :max-width="customModalMaxWidth(loading, false, modalWidth)"
    >
      <Loading v-if="loading" />
      <v-card v-else>
        <div class="tool-tip">
          <v-tooltip v-if="!viewRol" top color="blue-grey darken-4" dark>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click="(viewRol = true), (modalWidth = '1000')"
              >
                <v-icon>mdi mdi-eye-off</v-icon>
              </v-btn>
            </template>
            <span>Kuralları Göster</span>
          </v-tooltip>

          <v-tooltip v-if="viewRol" top color="blue-grey darken-4" dark>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                small
                v-bind="attrs"
                v-on="on"
                @click="(viewRol = false), (modalWidth = '600')"
              >
                <v-icon>mdi mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>Kuralları Kapat</span>
          </v-tooltip>
        </div>

        <ModalDetailHeader :header="updateEntity.description" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="6" class="row-modal">
                <v-text-field
                  v-model="updateEntity.description"
                  :rules="validation.required"
                  label="Rol Adı"
                  placeholder="Rol Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row class="row-modal">
              <v-col cols="12" md="2">
                <v-switch
                  v-model="updateEntity.isBlocked"
                  :label="updateEntity.isBlocked ? 'Pasif' : 'Aktif'"
                  color="red"
                ></v-switch>
              </v-col>
            </v-row>
            <v-data-table
              v-if="viewRol"
              class="mb-3"
              :headers="roleDetailHeaders"
              :items="rules"
              :items-per-page="-1"
              :hide-default-footer="true"
              item-key="id"
            >
              <template v-slot:item.view="{ item }">
                <v-switch
                  v-model="item.view"
                  color="info"
                  hide-details
                  class="mt-0"
                />
              </template>
              <template v-slot:item.insert="{ item }">
                <v-switch
                  v-model="item.insert"
                  color="success"
                  hide-details
                  class="mt-0"
                />
              </template>
              <template v-slot:item.update="{ item }">
                <v-switch
                  v-model="item.update"
                  color="teal"
                  hide-details
                  class="mt-0"
                />
              </template>
              <template v-slot:item.delete="{ item }">
                <v-switch
                  v-model="item.delete"
                  color="red"
                  hide-details
                  class="mt-0"
                />
              </template>
            </v-data-table>
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
import { mapGetters } from "vuex";
import { inputValidation } from "@/helpers/vuetify";
import { tableOptions } from "@/helpers/plugin-options";
import TableHeader from '@/components/shared/table/header'
import ModalBtnDropdown from '@/components/shared/modal-dropdown/btn-dropdown'
import ModalDetailHeader from '@/components/shared/modal-detail/header'
import ModalDetailFooter from '@/components/shared/modal-detail/footer'
import Loading from '@/components/shared/modal-loading'


export default {
  middleware: "auth-admin",
  head() {
    return { title: `Rol Tipleri ${process.env.title}` };
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
        { text: "Rol Adı", value: "description" },
        tableOptions.isBlockedColumn,
        tableOptions.actionColumn,
      ],
      valid: true,
      loading: false,
      validation: inputValidation,
      entity: {
        id: 0,
        description: "",
        isBlocked: false,
      },
      updateEntity: {
        id: 0,
        description: "",
        isBlocked: false,
      },
      dialog: false,
      dialogUpdate: false,

      roleDetailHeaders: [
        { text: "Modul Adı", value: "moduleName" },
        { text: "Görebilir", value: "view", width: 150, sortable: false },
        { text: "Ekleyebilir", value: "insert", width: 150, sortable: false },
        {
          text: "Güncelleyebilir",
          value: "update",
          width: 150,
          sortable: false,
        },
        { text: "Silebilir", value: "delete", width: 150, sortable: false },
      ],
      rules: [],
      viewRol: false,
      modalWidth: "600",
    };
  },
  async asyncData(state) {
    await state.store.dispatch("roles/getAll");
  },
  computed: {
    ...mapGetters({
      entities: "roles/getAll",
    }),
  },
  methods: {
    clearInput() {
      this.entity = {
        id: 0,
        description: "",
        isBlocked: false,
      };
    },
    create() {
      this.clearInput();
      this.dialog = true;
    },
    async Insert() {
      if (!this.$refs.form.validate()) return;
      await this.insertAction("roles", this.entity, false);
      await this.$store.dispatch("roles/getAll");
      this.dialog = false;
    },
    async Update() {
      if (!this.$refs.form.validate()) return;

      const response = await this.$store.dispatch(
        "roles/update",
        this.updateEntity
      );
      if (response.success) {
        this.rules.forEach((item) => {
          item.roleId = this.updateEntity.id;
        });
        await this.$store.dispatch("rules/saveRange", this.rules);
        await this.$store.dispatch("roles/getAll");
      }
      this.dialogUpdate = false;
    },

    async edit(id) {
      this.loading = true;
      this.dialogUpdate = true;
      this.updateEntity = await this.$RoleService.Get(id);
      this.rules = await this.$RuleService.GetAll(id);
      this.loading = false;
    },
    async deleteRange() {
      const list = this.selected.select("id");
      await this.deleteRangeAction("roles", list);
    },
    async isBlockedChange(id) {
      await this.isBlockedChangeAction("roles", id);
    },
  },
};
</script>

<style>
.tool-tip{
  position: absolute;
  top: 23px;
  z-index: 1;
  right: 15px;
}
</style>