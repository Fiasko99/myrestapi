import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

Vue.component('loader', {
    template: `
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 100px;">
            <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    `
})

new Vue({
    el: '#app',
    data() {
        return {
            loading: false,
            form: {
                name: '',
                value: '',
            },
            contacts: [],
        }
    },
    methods: {
        async createContact() {
            const {...contact} = this.form
            const newContact = await req('/api/contacts', 'POST', contact)
            this.contacts.push(newContact)
            this.form.name = this.form.value = ''
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id)
            const upd = await req(`/api/contacts/${id}`, 'PUT', {
                ...contact, 
                marked: !contact.marked
            })
            contact.marked = upd.marked
        },
        async deleteContact(id) {
            await req(`/api/contacts/${id}`, 'DELETE')
            this.contacts = this.contacts.filter(c => c.id !== id)
        },
    },
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    async mounted() {
        this.loading = true
        this.contacts = await req('/api/contacts')
        this.loading = false
    }
})

async function req(url, method = 'GET', data = null) {
    try {
        const headers = {}
        let body 
        if (data) {
            headers['Content-Type'] = 'application/json',
            body = JSON.stringify(data)
        }
        const res = await fetch(url, {
            method,
            headers,
            body
        })
        return res.json()
    } catch(e) {
        console.log(e)
    }
}