import * as Vue from "./vue.js";
import firstComponent from "./firstComponent.js";

Vue.createApp({
    components: {
        "first-component": firstComponent,
    },
    data() {
        return {
            images: [],
            title: "",
            description: "",
            file: null,
            username: "",
            imageSelected: null,
            imageAvailable: 1,
        };
    },
    mounted() {
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
            })
            .catch(console.log);
    },
    methods: {
        clickHandler: function () {
            const fd = new FormData();
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            fd.append("file", this.file);
            fetch("/upload.json", {
                method: "POST",
                body: fd,
            })
                .then((res) => res.json())
                .then((res) => {
                    this.title = "";
                    this.description = "";
                    this.$refs.fileInput.value = null;
                    this.username = "";
                    this.images.unshift(res.newImage);
                })
                .catch(console.log);
        },
        fileSelectHandler: function (e) {
            this.file = e.target.files[0];
        },
        imageHandler: function (selectedId) {
            this.imageSelected = selectedId;
        },
        closeComponent() {
            this.imageSelected = null;
        },
        moreClickHandler: function () {
            fetch("/images/more/" + this.images[this.images.length - 1].id, {
                method: "GET",
            })
                .then((res) => res.json())
                .then((data) => {
                    for (let i = 0; i < data.length; i++) {
                        this.images.push(data[i]);
                    }
                    if (
                        this.images[this.images.length - 1].id ==
                        data[data.length - 1].lowestId
                    ) {
                        this.imageAvailable = 0;
                    }
                })
                .catch(console.log);
        },
    },
}).mount("#main");
