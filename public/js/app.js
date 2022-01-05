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
            username: "",
            file: null,
            imageSelected: null,
        };
    },
    mounted() {
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
                this.images = data;
                console.log(this.images);
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
                .then((data) => {
                    console.log(data);
                    this.images.unshift(data);
                })
                .catch(console.log);
        },
        fileSelectHandler: function (e) {
            console.log("file selected", e);
            this.file = e.target.files[0];
        },
        imageHandler: function (selectedId) {
            console.log("Image was clicked");
            this.imageSelected = selectedId;
            console.log(selectedId);
        },
        closeComponent() {
            console.log(
                "the component has emitted that it should be closed :D"
            );
            this.imageSelected = null;
        },
    },
}).mount("#main");
