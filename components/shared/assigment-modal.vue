<template>
  <v-dialog
    v-model="dialog"
    persistent
    :max-width="maxWidth"
    :fullscreen="fullScreen"
    scrollable
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="getData"
        v-bind="attrs"
        v-on="on"
        class="text-capitalize green lighten-5 ml-2 d-flex"
        v-if="createModal"
      >
        <v-icon small>mdi-plus</v-icon>
        Yeni
      </v-btn>

      <v-btn
        @click="getData"
        v-bind="attrs"
        v-on="on"
        class="text-capitalize green lighten-5 ml-2 d-flex"
        v-if="myCreateModal"
      >
        <v-icon small>mdi-plus</v-icon>
        Yeni
      </v-btn>

      <v-list-item v-if="editModal" v-bind="attrs" v-on="on">
        <v-list-item-title @click="getAssigment(assigmentId)">
          <v-icon class="mr-2">ti-pencil-alt</v-icon>Düzenle
        </v-list-item-title>
      </v-list-item>
    </template>

    <v-card v-if="loading" class="grey darken-3">
      <v-card-text>
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0 mt-3"
        ></v-progress-linear>
      </v-card-text>
    </v-card>

    <!--INSERT-->
    <v-card style="max-height: 768px" v-if="!editModal && !loading">
      <v-toolbar flat color="white">
        <span class="headline">Yeni Görev</span>

        <v-menu>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip
              top
              color="blue-grey darken-4"
              dark
              content-class="px-2 py-1 caption"
            >
              <template v-slot:activator="{ on: tooltip }">
                <v-chip
                  class="ml-auto mr-2"
                  :color="
                    selectedAssigmentTag == null
                      ? 'blue-grey lighten-5'
                      : selectedAssigmentTag.tagBackgroundColor
                  "
                  :text-color="
                    selectedAssigmentTag == null
                      ? ''
                      : selectedAssigmentTag.tagColor
                  "
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                  small
                >
                  <v-icon class="ml-auto mr-2" x-small
                    >mdi-checkbox-blank-circle</v-icon
                  >
                  {{
                    selectedAssigmentTag == null
                      ? 'Görev Etiketi'
                      : selectedAssigmentTag.name
                  }}
                </v-chip>
              </template>
              <span>Görevi Etiketle</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="tag in assigmentTags"
              :key="tag.id"
              style="min-height: 36px !important"
              @click="selectedAssigmentTag = tag"
            >
              <v-chip
                :color="tag.tagBackgroundColor"
                :text-color="tag.tagColor"
                small
              >
                <v-icon class="mr-2" x-small>mdi-checkbox-blank-circle</v-icon>
                {{ tag.name }}
              </v-chip>
            </v-list-item>
            <v-list-item
              v-if="selectedAssigmentTag != null"
              style="min-height: 36px !important"
              @click="selectedAssigmentTag = null"
            >
              <v-chip color="blue-grey lighten-5" small>
                <v-icon class="mr-2" x-small>mdi-checkbox-blank-circle</v-icon>
                Etiketsiz
              </v-chip>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-tooltip
          top
          color="blue-grey darken-4"
          dark
          content-class="px-2 py-1 caption"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="dialogExpand"
              small
              v-bind="attrs"
              v-on="on"
              color="black"
            >
              <v-icon v-if="!fullScreen">mdi-window-restore</v-icon>
              <v-icon v-else>mdi-window-minimize</v-icon>
            </v-btn>
          </template>
          <span>{{ fullScreen ? 'Ortalı Ekran' : 'Tam Ekran' }}</span>
        </v-tooltip>

        <v-tooltip
          top
          color="blue-grey darken-4"
          dark
          content-class="px-2 py-1 caption"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="dialog = false"
              small
              v-bind="attrs"
              v-on="on"
              color="black"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Kapat</span>
        </v-tooltip>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row class="align-items-center">
            <v-col cols="12" :md="$auth.user.personnelType == 20 ? '8' : '12'">
              <v-text-field
                :color="titleColor(entity.title)"
                v-model="entity.title"
                :rules="validation.required"
                label="Görev Adı"
                placeholder="Görev Adı"
                dense
                outlined
                :counter="100"
                :maxlength="100"
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              v-if="$auth.user.personnelType == 20"
              :md="$auth.user.personnelType == 20 ? '4' : '6'"
            >
              <v-select
                v-model="entity.priority"
                :rules="validation.required"
                :items="priorities"
                item-value="id"
                item-text="description"
                label="Öncelik"
                placeholder="Öncelik Seçin"
                dense
                outlined
              ></v-select>
            </v-col>
          </v-row>

          <v-row class="align-items-center">
            <v-col cols="12" md="8" v-if="$auth.user.personnelType == 20">
              <AutoCompletePersonnels
                :isRequired="true"
                :Id="entity.personnelId"
                :isLoading="loadingSearch"
                @searchValue="searchValuePersonnels($event)"
                @input="selectPersonnel($event)"
                :items="searchPersonnels"
                itemValue="id"
                itemText="description"
              />
            </v-col>
            <v-col
              cols="12"
              v-if="$auth.user.personnelType != 20"
              :md="$auth.user.personnelType == 20 ? '4' : '6'"
            >
              <v-select
                v-model="entity.priority"
                :rules="validation.required"
                :items="priorities"
                item-value="id"
                item-text="description"
                label="Öncelik"
                placeholder="Öncelik Seçin"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" :md="$auth.user.personnelType == 20 ? '4' : '6'">
              <v-menu
                v-model="modal"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="formatDate(entity.dueDate, 'DD.MM.YYYY')"
                    label="Bitiş Tarihini Seçiniz"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    dense
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="tr"
                  v-model="entity.dueDate"
                  @input="modal = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" class="py-0">
              <span
                >İçerik <span style="color:red;font-size:12px;">* Zorunlu</span>
              </span>
              <HtmlEditor v-model="entity.htmlContent" class="pb-1 pt-2" />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Vazgeç</v-btn>

        <v-btn color="blue darken-1" text @click="Insert()">Kaydet</v-btn>
      </v-card-actions>
    </v-card>

    <!--UPDATE-->
    <v-card style="max-height: 768px" v-if="editModal && !loading">
      <v-toolbar flat color="white">
        <span class="headline">Görev Düzenle</span>

        <v-menu>
          <template v-slot:activator="{ on: menu, attrs }">
            <v-tooltip
              top
              color="blue-grey darken-4"
              dark
              content-class="px-2 py-1 caption"
            >
              <template v-slot:activator="{ on: tooltip }">
                <v-chip
                  class="ml-auto mr-2"
                  :color="
                    selectedAssigmentTag == null
                      ? 'blue-grey lighten-5'
                      : selectedAssigmentTag.tagBackgroundColor
                  "
                  :text-color="
                    selectedAssigmentTag == null
                      ? ''
                      : selectedAssigmentTag.tagColor
                  "
                  v-bind="attrs"
                  v-on="{ ...tooltip, ...menu }"
                  small
                >
                  <v-icon class="ml-auto mr-2" x-small
                    >mdi-checkbox-blank-circle</v-icon
                  >
                  {{
                    selectedAssigmentTag == null
                      ? 'Görev Etiketi'
                      : selectedAssigmentTag.name
                  }}
                </v-chip>
              </template>
              <span>Görevi Etiketle</span>
            </v-tooltip>
          </template>
          <v-list>
            <v-list-item
              v-for="tag in assigmentTags"
              :key="tag.id"
              style="min-height: 36px !important"
              @click="selectedAssigmentTag = tag"
            >
              <v-chip
                :color="tag.tagBackgroundColor"
                :text-color="tag.tagColor"
                small
              >
                <v-icon class="mr-2" x-small>mdi-checkbox-blank-circle</v-icon>
                {{ tag.name }}
              </v-chip>
            </v-list-item>
            <v-list-item
              v-if="selectedAssigmentTag != null"
              style="min-height: 36px !important"
              @click="selectedAssigmentTag = null"
            >
              <v-chip color="blue-grey lighten-5" small>
                <v-icon class="mr-2" x-small>mdi-checkbox-blank-circle</v-icon>
                Etiketsiz
              </v-chip>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-tooltip
          top
          color="blue-grey darken-4"
          dark
          content-class="px-2 py-1 caption"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="dialogExpand"
              small
              v-bind="attrs"
              v-on="on"
              color="black"
            >
              <v-icon v-if="!fullScreen">mdi-window-restore</v-icon>
              <v-icon v-else>mdi-window-minimize</v-icon>
            </v-btn>
          </template>
          <span>{{ fullScreen ? 'Ortalı Ekran' : 'Tam Ekran' }}</span>
        </v-tooltip>

        <v-tooltip
          top
          color="blue-grey darken-4"
          dark
          content-class="px-2 py-1 caption"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              @click="dialog = false"
              small
              v-bind="attrs"
              v-on="on"
              color="black"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>Kapat</span>
        </v-tooltip>
      </v-toolbar>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row class="align-items-center">
            <v-col cols="12" md="12">
              <v-text-field
                :color="titleColor(updateEntity.title)"
                v-model="updateEntity.title"
                :rules="validation.required"
                label="Görev Adı"
                placeholder="Görev Adı"
                dense
                outlined
                :counter="100"
                :maxlength="100"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="align-items-center">
            <v-col cols="12" md="6">
              <v-select
                v-model="updateEntity.priority"
                :rules="validation.required"
                :items="priorities"
                item-value="id"
                item-text="description"
                label="Öncelik"
                placeholder="Öncelik Seçin"
                dense
                outlined
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                v-model="modal"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="formatDate(updateEntity.dueDate, 'DD.MM.YYYY')"
                    label="Bitiş Tarihini Seçiniz"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    dense
                    outlined
                  ></v-text-field>
                </template>
                <v-date-picker
                  locale="tr"
                  v-model="updateEntity.dueDate"
                  @input="modal = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
          <v-row>
            <v-btn
              v-if="!htmlContent"
              class="text-capitalize mb-1"
              small
              text
              @click="htmlContent = true"
            >
              İçeriği Göster
              <v-icon small class="ml-2">mdi mdi-eye-off</v-icon>
            </v-btn>

            <v-btn
              v-else
              class="text-capitalize mb-1"
              small
              text
              @click="htmlContent = false"
            >
              İçeriği Kapat
              <v-icon small class="ml-2">mdi mdi-eye</v-icon>
            </v-btn>

            <v-col cols="12" class="py-0" v-if="htmlContent">
              <span
                >İçerik <span style="color:red;font-size:12px;">* Zorunlu</span>
              </span>
              <HtmlEditor
                v-model="updateEntity.htmlContent"
                class="pb-1 pt-2"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">Vazgeç</v-btn>

        <v-btn color="blue darken-1" text @click="Update()">Kaydet</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

import { inputValidation } from '@/helpers/vuetify'
import { confirmOption } from '@/helpers/plugin-options'
import AutoCompletePersonnels from '@/components/shared/autoPersonnelComplete'

export default {
  props: {
    editModal: {
      type: Boolean,
      default: false
    },
    myCreateModal: {
      type: Boolean,
      default: false
    },
    createModal: {
      type: Boolean,
      default: false
    },
    assigmentId: {
      type: Number,
      required: false,
      default: 0
    }
  },
  components: {
    AutoCompletePersonnels,
    HtmlEditor: () => import('@/components/shared/html-editor')
  },
  data() {
    return {
      searchPersonnels: [],
      priorities: [],
      selectedAssigmentTag: null,
      dialog: false,
      fullScreen: false,
      modal: false,
      loading: false,
      valid: true,
      loadingSearch: false,
      validation: inputValidation,
      entity: {
        id: 0,
        personnelId: 0,
        assigmentTagId: null,
        createdUser: '',
        title: '',
        htmlContent: '',
        priority: 0,
        dueDate: new Date().toISOString().substr(0, 10)
      },
      updateEntity: {
        id: 0,
        personnelId: 0,
        assigmentTagId: null,
        createdUser: '',
        title: '',
        htmlContent: '',
        priority: 0,
        dueDate: new Date().toISOString().substr(0, 10)
      },
      htmlContent: false
    }
  },
  computed: {
    ...mapGetters({
      assigmentTags: 'assigmentTags/getAll',
      personnels: 'personnels/getSelectList'
    }),
    maxWidth: function() {
      if (this.fullScreen) return '100%'

      if (this.loading) {
        return '344px'
      } else {
        return '768px'
      }
    }
  },
  methods: {
    clearInput() {
      this.entity = {
        id: 0,
        personnelId: 0,
        assigmentTagId: null,
        createdUser: '',
        title: '',
        htmlContent: '',
        priority: 0,
        dueDate: new Date().toISOString().substr(0, 10)
      }
      this.selectedAssigmentTag = null
    },
    async Insert() {
      if (!this.$refs.form.validate()) return
      if (this.selectedAssigmentTag != null) {
        this.entity.assigmentTagId = this.selectedAssigmentTag.id
      } else {
        this.entity.assigmentTagId = null
      }
      await this.insertAction('assigments', this.entity)
      if (this.createModal) {
        await this.$store.dispatch('assigments/getAll')
      }
      if (this.myCreateModal) {
        await this.$store.dispatch('assigments/getAllMyAssigment')
      }
      this.getChart();
      this.dialog = false
    },
    selectPersonnel(id) {
      this.entity.personnelId = this.searchPersonnels.filter(
        x => x.id == id
      )[0].id
    },
    async searchValuePersonnels(value) {
      var self = this
      this.delay(async function() {
        self.loadingSearch = true
        if (value.length <= 2) {
          self.searchPersonnels = []
          self.loadingSearch = false
          return
        }
        self.searchPersonnels = await self.$PersonnelService.Search(value)
        self.loadingSearch = false
      }, 1000)
    },
    async getData() {
      this.clearInput()
      this.loading = true
      await this.$store.dispatch('assigmentTags/getAll')
      this.priorities = await this.$AssigmentService.PriorityDegree()
      this.loading = false
    },
    async Update() {
      await this.updateAction('assigments', this.updateEntity)
      await this.$store.dispatch('assigments/getAll')
      this.dialog = false
    },
    async getAssigment(id) {
      await this.getData()
      this.updateEntity = await this.$AssigmentService.Get(id)
      this.searchPersonnels = this.personnels.filter(
        x => x.id == this.updateEntity.personnelId
      )
    },
    dialogExpand() {
      this.fullScreen = !this.fullScreen
    }
  }
}
</script>

<style></style>
