<template>
  <section class="tables w-100 p-0">
    <v-toolbar color="blue-grey darken-4" dark>
      <v-toolbar-title>Bildirimlerim</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-fab-transition>
        <v-text-field
          v-show="enableSearch"
          v-model="searchKey"
          hide-details
          single-line
        ></v-text-field>
      </v-fab-transition>
      <v-btn
        icon
        @click="enableSearch = !enableSearch"
        v-if="entities.length > 0"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon @click="refresh">
        <v-icon>mdi-sync</v-icon>
      </v-btn>
      <!-- <v-badge
        :content="selected.length"
        :value="selected.length"
        color="orange darken-2"
        overlap
        v-if="entities.length > 0"
      >
        <v-btn
          icon
          @click="selectAll"
          :color="isSelectedAll ? 'orange darken-2' : 'white'"
        >
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-btn>
      </v-badge> -->

      <!-- <v-menu>
        <template v-slot:activator="{ on, attrs }">
          <v-fab-transition>
            <v-btn icon v-show="isSelected" v-bind="attrs" v-on="on">
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-fab-transition>
        </template>

        <v-list nav dense>
          <v-list-item-group>
            <v-list-item @click="hasReaded">
              <v-list-item-icon>
                <v-icon>mdi-eye</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Okundu Olarak İşaretle</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="hasNotReaded">
              <v-list-item-icon>
                <v-icon>mdi-eye-off</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Okunmadı Olarak İşaretle</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="deleteRange">
              <v-list-item-icon>
                <v-icon>mdi-delete</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Sil</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu> -->
    </v-toolbar>
    <v-skeleton-loader
      v-show="refreshLoading"
      v-for="i in entities.length"
      :key="i"
      ref="skeleton"
      :boilerplate="false"
      type="list-item-avatar-two-line"
      :tile="false"
      class="mx-auto py-4 bg-white"
    ></v-skeleton-loader>

    <v-list two-line v-show="!refreshLoading">
      <v-list-item-group v-model="selected">
        <template v-for="(item, index) in filteredEntities">
          <v-list-item :key="item.id">
            <template v-slot:default="{ active }">
              <!-- <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-chip
                    class="m-0 p-0"
                    color="transparent"
                    v-bind="attrs"
                    v-on="on"
                    :text-color="item.readingDate == null ? 'red' : 'grey'"
                  >
                    <v-icon left> mdi-label </v-icon>
                  </v-chip>
                </template>
                <span>{{
                  item.readingDate == null
                    ? "Okunmadı"
                    : formatDate(item.readingDate)
                }}</span>
              </v-tooltip> -->

              <v-list-item-action class="mr-2">
                <v-icon v-if="!item.isRead" color="grey lighten-1">
                  mdi mdi-check-all
                </v-icon>

                <v-icon v-else color="blue darken-3">
                  mdi mdi-check-all
                </v-icon>
              </v-list-item-action>
              <v-list-item-avatar class="mr-2">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-img
                      :src="personnelPhoto(item.personnelInfo.profilePhoto)"
                      v-bind="attrs"
                      v-on="on"
                    ></v-img>
                  </template>
                  <span>{{ item.personnelInfo.firstName }}</span>
                </v-tooltip>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-text="item.notificationTitle"
                ></v-list-item-title>

                <v-list-item-subtitle>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <span v-bind="attrs" v-on="on">{{
                        fromNow(item.createdAt)
                      }}</span>
                    </template>
                    <span>{{ formatDate(item.createdAt) }}</span>
                  </v-tooltip>
                </v-list-item-subtitle>
              </v-list-item-content>
               <v-list-item-action class="mr-2" @click="remove(item.id)">
                <v-icon> mdi mdi-delete </v-icon>
              </v-list-item-action>
              <v-list-item-action class="mr-2" @click="hasRead(item)">
                <v-icon> mdi-receipt </v-icon>
              </v-list-item-action>
            </template>
          </v-list-item>

          <v-divider
            v-if="index < filteredEntities.length - 1"
            :key="index"
          ></v-divider>
        </template>
      </v-list-item-group>
    </v-list>

    <div
      class="w-100 d-flex flex-column bg-white py-4"
      v-if="entities.length == 0"
    >
      <div class="d-flex justify-content-center">
        <v-avatar size="128">
          <v-img src="/notNotify.png"></v-img>
        </v-avatar>
      </div>
      <div class="d-flex justify-content-center">
        <h4 class="mb-0 mt-3">Maalesefki hiç bildiriminiz yok.</h4>
      </div>
    </div>

    <v-dialog
      v-model="dialog"
      persistent
      :max-width="customModalMaxWidth(loading, false, 450)"
    >
      <Loading v-if="loading" />
      <v-card v-else>
        <v-card-text class="p-3">
          <div class="d-flex mb-3">
            <h5>
              {{ entity.notificationTitle }}
            </h5>
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <span class="ml-auto" v-bind="attrs" v-on="on">{{
                  formatDate(entity.createdAt, 'DD.MM.YYYY')
                }}</span>
              </template>
              <span>{{
                formatDate(entity.createdAt, 'DD.MM.YYYY HH:mm')
              }}</span>
            </v-tooltip>
          </div>
          <p>{{ entity.notificationMessage }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog = false">Kapat</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>
<script>
import { mapGetters } from 'vuex'
import { tableOptions } from '@/helpers/plugin-options'
import { confirmOption } from '@/helpers/plugin-options'
import Loading from '@/components/shared/modal-loading'

export default {
  middleware: 'auth-user',
  head() {
    return { title: `Bildirimlerim ${process.env.title}` }
  },
  components: {
    Loading
  },
  data() {
    return {
      selected: [],
      enableSearch: false,
      searchKey: '',
      refreshLoading: false,
      dialog: false,
      loading: false,
      entity: {}
    }
  },
  async asyncData(state) {
    await state.store.dispatch('personnelNotifications/getMyAllNotification')
  },
  computed: {
    ...mapGetters({
      entities: 'personnelNotifications/getMyAllNotification'
    }),
    filteredEntities: function() {
      return this.searchKey == ''
        ? this.entities
        : this.entities.filter(
            x =>
              String(x.notificationTitle)
                .toLocaleLowerCase()
                .indexOf(String(this.searchKey).toLocaleLowerCase()) > -1
          )
    },
    isSelectedAll: function() {
      return this.selected.length == this.entities.length
    },
    isSelected: function() {
      return this.selected.length > 0
    }
  },
  methods: {
    async remove(id){
      await this.deleteAction("personnelNotifications",id);
    },
    async refresh() {
      this.refreshLoading = true
      await this.$store.dispatch('personnelNotifications/getMyAllNotification')
      await this.wait(1000)
      this.refreshLoading = false
    },
    async hasRead(item) {
      this.entity = item
      this.loading = true
      if (!item.isRead) {
        await this.$store.dispatch(
          'personnelNotifications/readMyNotification',
          item.id
        )
        await this.$store.dispatch(
          'personnelNotifications/getMyAllNotification'
        )
      }
      this.dialog = true
      this.loading = false
    },
    selectAll() {
      if (this.isSelectedAll) {
        this.selected = []
        return
      }
      let list = []
      for (let index = 0; index < this.entities.length; index++) {
        list.push(index)
      }
      this.selected = list
    },
    async deleteRange() {
      let list = []
      this.selected.forEach(index => {
        list.push(this.entities[index].notificationId)
      })
      await this.$store.dispatch(
        'personnelNotifications/deleteMyNotification',
        list
      )
      this.selected = []
      await this.$store.dispatch(
        'personnelNotifications/getMyAllNotification',
        true
      )
    }
  }
}
</script>
