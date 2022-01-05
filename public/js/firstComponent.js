const firstComponent = {
    props: ["imageId"],
    data() {
        return {
            heading: "first component 🧅",
            image: [],
            url: "",
            title: "",
            description: "",
            username: "",
        };
    },
    mounted() {
        console.log("first component just mounted");
        console.log(this.imageId);
        fetch("/images")
            .then((resp) => resp.json())
            .then((data) => {
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
    template: `<div id="modal">
    <div id="modal-container">
    <p @click="notifyParent" class="close">X</p>
    <p>{{image.title}}</p>
    <img :src="image.url">
    </div>
    </div>`,
};

export default firstComponent;
