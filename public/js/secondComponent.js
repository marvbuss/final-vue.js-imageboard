const secondComponent = {
    props: ["imageId"],
    data() {
        return {
            heading: "second component 🧅",
            comments: [],
            username: "",
            comments_text: "",
        };
    },
    mounted() {
        console.log("second component just mounted");
        fetch(`/comments/${this.imageId}.json`)
            .then((resp) => resp.json())
            .then((data) => {
                this.comments = data;
                console.log(this.comments);
            })
            .catch(console.log);
    },
    methods: {
        commentClickHandler: function () {
            const payload = {
                comments_text: this.comments_text,
                username: this.username,
                imageId: this.imageId,
            };
            fetch("/comment.json", {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(payload),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    this.comments.push(data);
                })
                .catch(console.log);
        },
    },
    template: `
    <div id="comments-container">
        <form>
            <input v-model="comments_text" type="text" name="comments_text" placeholder="comments_text">
            <input v-model="username" type="text" name="username" placeholder="username">
            <button @click.prevent="commentClickHandler">Submit</button>
        </form>
        <div class="comments" v-for='comment in comments' :key='comment.id'>
        <p>{{comment.created_at}}</p>
        <p>{{comment.username}}</p>
        <p>{{comment.comments_text}}</p>
        </div>
    </div>`,
};

export default secondComponent;
