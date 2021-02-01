<template>
  <div class="d-flex align-items-center" v-if="$auth.user.personnelId!=1">
    <b-nav-item-dropdown right class="preview-list">
      <template slot="button-content">
        <v-badge
          class="notify-count"
          :content="activeUser.length"
          :value="activeUser.length"
          color="green"
        >
          <v-icon> ti-bell mx-0 </v-icon>
        </v-badge>
      </template>
      <h6 class="p-3 mb-0">Bildirimlerim</h6>
      <b-dropdown-item
        class="preview-item"
        v-for="item in activeUser"
        :key="item.id"
        @click="$router.push('/my-notifications')"
        href="javascript://"
      >
        <div class="preview-thumbnail">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-avatar>
                <img
                  :src="personnelPhoto(item.personnelInfo.profilePhoto)"
                  v-bind="attrs"
                  v-on="on"
                />
              </v-avatar>
            </template>
            <span>{{ item.personnelInfo.firstName }}</span>
          </v-tooltip>
        </div>
        <div class="preview-item-content">
          <h6 class="preview-subject font-weight-normal">
            {{ item.notificationTitle }}
          </h6>
          <p class="font-weight-light small-text mb-0 text-muted">
            {{ fromNow(item.CreatedAt) }}
          </p>
        </div>
      </b-dropdown-item>
      <b-dropdown-item class="preview-item" v-if="items.length == 0">
        <div class="preview-item-content">
          <h6 class="preview-subject font-weight-normal">
            Hiç Yeni Bildiriminiz Yok
          </h6>
        </div>
      </b-dropdown-item>
    </b-nav-item-dropdown>
    <v-snackbar v-model="snackbar" :timeout="20 * 1000">
      {{ activeUser.length }} yeni bildiriminiz var
      <template v-slot:action="{ attrs }">
        <v-btn
          color="orange darken-4"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Kapat
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import errorPagesVue from '../../layouts/error-pages.vue'

export default {
  data() {
    return {
      oldItems: [],
      snackbar: false,
      connection: ''
    }
  },
  methods: {
     getNotfiy() {
      if (this.$auth.user.personnelId==1) return;

      this.$store.dispatch('personnelNotifications/getAllNotify')

      if (this.items.length > this.oldItems.length) {
        this.snackbar = true
        this.oldItems = [...this.items]
        if (process.client) {
          var audio = new Audio('/sounds/notify-sound.mp3')
          audio.play()
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      items: 'personnelNotifications/myActiveNotification'
    }),
    activeUser(){
      return this.items.filter(x=>x.personnelInfo.id==this.$auth.user.personnelId)
    }
  },
  mounted() {
    this.getNotfiy()
  }
}
</script>

<style>
.notify-count .v-badge__badge {
  top: -7px !important;
  left: 17px !important;
}
</style>
