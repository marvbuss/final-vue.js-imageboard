import secondComponent from "./secondComponent.js";

const firstComponent = {
    components: {
        "second-component": secondComponent,
    },
    props: ["imageId"],
    data() {
        return {
            image: [],
            url: "",
            title: "",
            description: "",
            username: "",
        };
    },
    mounted() {
        console.log(
            "first component just mounted for this imageId:",
            this.imageId
        );
        fetch(`/images/${this.imageId}`)
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                this.image = data.find((e) => e.id == this.imageId);
            })
            .catch(console.log);
    },
    methods: {
        notifyParent() {
            console.log("first component here the parent app should do sth");
            // to notify the parent that it should do sth we emit
            this.$emit("close");
        },
    },
    template: `
    <div id="modal">
    <div id="modal-container">
    <p @click="notifyParent" class="close">X</p>
    <p>{{image.title}}</p>
    <img :src="image.url">
    <second-component :image-id="imageId"></second-component>
    </div>
    </div>`,
};

export default firstComponent;
