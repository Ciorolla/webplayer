import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

const state = {
    files: [],
    discs: [],
    songToPlay: "",
    isPaused: true,
    duration: null
}

const getters = {
    getImages(state) {
        return state.discs
    },
    getItems(state) {
        return state.files
    },
    gettstsrc(state) {
        return state.files[0].src
    },
    getSong(state) {
        return state.songToPlay
    },
    getPause(state) {
        return state.isPaused
    }

}

const actions = {

    firstAction(state) {
        fetch("http://localhost:3000/first", { method: "post" })
            .then(response => response.json())
            .then(

                data => {
                    state.commit("SET_FILES", data)
                }
            )

    },

    next(state, discName) {
        const body = discName
        console.log(discName)
        fetch("http://localhost:3000/next", { method: "post", body, })
            .then(response => response.json())
            .then(

                data => {
                    state.commit("SET_NEXT_FILES", data)
                }
            )

    },

    iWantNewSong(state, songUrl) {
        //console.log(songUrl)
        state.commit("SET_SONG", songUrl)

    },

    addToPlaylist(state, customjson) {
        const body = customjson
        console.log(customjson)
        fetch("http://localhost:3000/addNdb", { method: "post", body, })

    }


}

const mutations = {
    SET_FILES(state, data) {

        state.discs = data.albums
        state.files = data.files

        console.log(state.discs)
        console.log(state.files)
    },
    SET_NEXT_FILES(state, data) {

        state.files = data.files

        console.log(state.files)
    },
    SET_SONG(state, data) {

        state.songToPlay = data
        console.log(data)
        //console.log(state.songToPlay)
    },
    SET_PLAY(state) {
        state.isPaused = true
    },
    SET_PAUSE(state) {
        state.isPaused = false
    },
    NEXT_PLAY(state) {
        let flag = false
        let flag2 = true
        for (let file of state.files) {
            if (flag) {
                state.songToPlay = ("http://" + file.src)
                console.log("zmienione" + file.src)
                flag = false
            }
            if ((("http://" + file.src) == state.songToPlay) && (flag2)) {
                flag = true
                flag2 = false
                console.log("do zmiany" + file.src)
            }



        }
    },
    PREV_PLAY(state) {
        let flag = false
        let flag2 = true
        let reversed = (state.files).reverse()
        for (let file of reversed) {
            if (flag) {
                state.songToPlay = ("http://" + file.src)
                console.log("zmienione" + file.src)
                flag = false
            }
            if ((("http://" + file.src) == state.songToPlay) && (flag2)) {
                flag = true
                flag2 = false
                console.log("do zmiany" + file.src)
            }



        }
        (state.files).reverse()

    }


}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})