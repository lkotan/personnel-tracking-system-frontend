<template>
  <section class="w-100">
    <div class="card">
      <TableHeader
        header="E-Posta Şablonları"
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
          <template v-slot:item.actions="{ item }">
            <ModalBtnDropdown :id="item.id" @edit="edit(item.id)" />
          </template>
        </v-data-table>
      </div>
    </div>

    <!--INSERT MODAL-->
    <v-dialog v-model="dialog" persistent max-width="650px">
      <v-card>
        <ModalDetailHeader header="Yeni E-Posta Şablonu" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="entity.title"
                  :rules="validation.required"
                  label="Şablon Adı"
                  placeholder="Şablon Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="entity.templateType"
                  :items="parameterTypes"
                  :rules="validation.required"
                  item-value="id"
                  item-text="description"
                  label="Şablon Tipi"
                  dense
                  outlined
                  placeholder="Şablon Tipi"
                />
              </v-col>
            </v-row>

            <v-row class="code-editor">
              <v-col cols="12" md="8">
                <v-autocomplete
                  v-model="entity.emailParameterId"
                  :items="parameters"
                  label="E-Posta Parametresi"
                  :rules="validation.required"
                  item-text="name"
                  item-value="id"
                  dense
                  outlined
                  placeholder="E-Posta Parametresi"
                >
                  <template v-slot:selection="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="data.item.name"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-html="data.item.userName"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                  <template v-slot:item="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="data.item.name"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-html="data.item.userName"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <client-only>
                  <CodeEditor v-model="entity.messageTemplate" />
                </client-only>
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
      :max-width="customModalMaxWidth(loading, false,650)"
    >
      <Loading v-if="loading" />
      <v-card v-else>
        <ModalDetailHeader header="E-Mail Şablonu Düzenle" />
        <v-card-text class="pb-0">
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-row class="row-modal">
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="updateEntity.title"
                  :rules="validation.required"
                  label="Şablon Adı"
                  placeholder="Şablon Adı"
                  dense
                  outlined
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="updateEntity.templateType"
                  :items="parameterTypes"
                  :rules="validation.required"
                  item-value="id"
                  item-text="description"
                  label="Şablon Tipi"
                  dense
                  outlined
                  placeholder="Şablon Tipi"
                />
              </v-col>
            </v-row>

            <v-row class="mb-3">
              <v-col cols="12" md="8">
                <v-autocomplete
                  v-model="updateEntity.emailParameterId"
                  :items="parameters"
                  label="E-Posta Parametresi"
                  :rules="validation.required"
                  item-text="name"
                  item-value="id"
                  dense
                  outlined
                  placeholder="E-Posta Parametresi"
                >
                  <template v-slot:selection="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="data.item.name"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-html="data.item.userName"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                  <template v-slot:item="data">
                    <template>
                      <v-list-item-content>
                        <v-list-item-title
                          v-html="data.item.name"
                        ></v-list-item-title>
                        <v-list-item-subtitle
                          v-html="data.item.userName"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                  <client-only>
                    <CodeEditor v-model="updateEntity.messageTemplate" />
                  </client-only>
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
  middleware: "auth-admin",
  head() {
    return { title: `E-Mail Şablonları ${process.env.title}` };
  },
   components: {
    TableHeader,
    ModalBtnDropdown,
    ModalDetailHeader,
    Loading,
    ModalDetailFooter,
    CodeEditor: () => import("../../components/shared/code-editor"),
  },
   data() {
    return {
      ...tableOptions.defaultData,
      headers: [
        { text: "Şablon Adı", value: "title" },
        tableOptions.actionColumn,
      ],
      valid: true,
      loading: false,
      validation: inputValidation,
      dialog: false,
      dialogUpdate: false,
      entity: {
        id: 0,
        title: "",
        emailParameterId: 0,
        templateType: 0,
        messageTemplate: "",
      },
      updateEntity: {
        id: 0,
        title: "",
        emailParameterId: 0,
        templateType: 0,
        messageTemplate: "",
      },
      parameters: [],
      parameterTypes: [],
    };
  },
  async asyncData(state) {
    await state.store.dispatch("emailTemplates/getAll");
  },
  computed: {
    ...mapGetters({
      entities: "emailTemplates/getAll",
    }),
  },
  methods: {
    clearInput() {
      this.entity = {
        id: 0,
        title: "",
        emailParameterId: 0,
        templateType: 0,
        messageTemplate: "",
      };
    },
    async create() {
      this.clearInput();
      this.parameterTypes = await this.$store.dispatch(
        "emailTemplates/getEmailTemplateTypes"
      );
      this.parameters = await this.$EmailParameterService.GetAll();
      this.dialog = true;
    },
    async Insert() {
      if (!this.$refs.form.validate()) return;
      console.log(this.entity);
      await this.insertAction("emailTemplates", this.entity);
      await this.$store.dispatch("emailTemplates/getAll");
      this.dialog = false;
    },
    async Update(){
      if (!this.$refs.form.validate()) return;
      console.log(this.updateEntity);
      await this.updateAction("emailTemplates", this.updateEntity);
      await this.$store.dispatch("emailTemplates/getAll");
      this.dialogUpdate = false;
    },
    async edit(id) {
      this.loading = true;
      this.dialogUpdate = true;
      this.parameterTypes = await this.$store.dispatch(
        "emailTemplates/getEmailTemplateTypes"
      );
      this.parameters = await this.$EmailParameterService.GetAll();
      this.updateEntity = await this.$EmailTemplateService.Get(id);
      this.loading = false;
    },
    async deleteRange() {
      const list = this.selected.select("id");
      await this.deleteRangeAction("emailTemplates", list);
    },
  },
}

</script>

<style>
.v-sheet.theme--dark.v-toolbar.v-toolbar--flat{
 height: 44px !important;
}
.v-sheet.theme--dark.v-toolbar.v-toolbar--flat > .v-toolbar__content{
  height: 44px !important;
}
</style>