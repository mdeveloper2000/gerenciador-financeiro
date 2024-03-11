const { createApp, ref } = Vue
const { useToast } = primevue.usetoast
const { useConfirm } = primevue.useconfirm

const App = {
    
    setup() {
        const receitas = ref(0)
        const despesas = ref(0)
        const total = ref(0)
        const tipo = ref('')
        const tipo_edit = ref('')
        const tipos = ref(['RECEITA', 'DESPESA'])
        const valor = ref(0)
        const valor_edit = ref(0)
        const descricao = ref('')
        const descricao_edit = ref('')
        const financas = ref([])
        const showNew = ref(false)
        const showEdit = ref(false)
        const hasErrors = ref(false)
        const hasEditErrors = ref(false)        
        const id = ref(0)
        const toast = useToast()        
        const confirm = useConfirm()

        return {
            receitas, despesas, total, tipo, tipo_edit, tipos, valor, valor_edit, descricao, descricao_edit, 
            financas, showNew, hasErrors, hasEditErrors, toast, showEdit, id, confirm
        }
    },
    components: {
        "p-button": primevue.button,
        "p-message": primevue.message,
        "p-dialog": primevue.dialog,
        "p-inputtext": primevue.inputtext,
        "p-column": primevue.column,
        "p-datatable": primevue.datatable,
        "p-toast": primevue.toast,
        "p-panel": primevue.panel,        
        "p-confirmdialog": primevue.confirmdialog,
        "p-inputnumber": primevue.inputnumber,
        "p-selectbutton": primevue.selectbutton,
        "p-card": primevue.card
    },    
    methods: {
        save() {
            if(this.valor === 0 || this.tipo.trim() === '' || this.descricao.trim() === '') {
                this.hasErrors = true
            }
            else {
                const storage = localStorage.getItem("financas")
                let index = 1
                if(storage !== null) {                    
                    index = JSON.parse(storage).length + 1
                }
                if(this.tipo === "RECEITA") {
                    this.receitas += this.valor
                }
                else {
                    this.despesas += this.valor
                }
                this.total += this.valor
                const financa = {
                    id: index,
                    valor: this.valor,
                    tipo: this.tipo,
                    descricao: this.descricao                    
                }
                this.financas.push(financa)
                localStorage.setItem("financas", JSON.stringify(this.financas))
                this.toast.add({ severity: "success", summary: "Mensagem", detail: "Finança registrada com sucesso", life: 3000 })
                this.clearNewFields()
            }
        },
        edit(id) {
            this.showEdit = true
            const financaEdit = this.financas.find((financa) => financa.id === id)
            this.id = id
            this.valor_edit = financaEdit.valor
            this.tipo_edit = financaEdit.tipo
            this.descricao_edit = financaEdit.descricao
        },
        update() {
            if(this.valor_edit === 0 || this.tipo_edit.trim() === '' || this.descricao_edit.trim() === '') {
                this.hasEditErrors = true
            }
            else {                
                this.financas.map(financa => {
                    if(financa.id === this.id) {
                        financa.valor = this.valor_edit
                        financa.tipo = this.tipo_edit
                        financa.descricao = this.descricao_edit
                        localStorage.setItem("financas", JSON.stringify(this.financas))
                        this.showEdit = false
                        this.toast.add({ severity: "info", summary: "Mensagem", detail: "Finança atualizada com sucesso", life: 3000 })
                        this.clearEditFields()
                        const storage = localStorage.getItem("financas")
                        this.calculate(storage)
                    }
                })
            }
        },
        clearNewFields() {
            this.valor = ''
            this.descricao = ''
            this.tipo = ''
            this.hasErrors = false
            this.showNew = false
        },
        clearEditFields() {
            this.id = 0
            this.valor_edit = ''
            this.descricao_edit = ''
            this.tipo_edit = ''
            this.hasEditErrors = false
            this.showEdit = false
        },
        deleteRow(id) {
            this.confirm.require({
                message: 'Deseja realmente deletar esse registro?',
                header: 'Deletar Finança',
                icon: 'pi pi-info-circle',
                rejectLabel: 'Cancelar',
                acceptLabel: 'Deletar',
                rejectClass: 'p-button-secondary p-button-outlined',
                acceptClass: 'p-button-danger',
                accept: () => {                    
                    this.financas = this.financas.filter(financa => financa.id !== id)                    
                    localStorage.setItem("financas", JSON.stringify(this.financas))                    
                    this.toast.add({ severity: "error", summary: "Mensagem", detail: "Finança deletada com sucesso", life: 3000 })
                    const storage = localStorage.getItem("financas")
                    this.calculate(storage)
                },
                reject: () => {
                }
            })
        },
        calculate(storage) {
            this.financas = JSON.parse(storage)
            this.receitas = 0
            this.despesas = 0
            this.total = 0
            this.financas.map((financa) => {
                if(financa.tipo === "RECEITA") {
                    this.receitas += financa.valor
                }
                else {
                    this.despesas += financa.valor
                }
                this.total += financa.valor
            })
        }
    },    
    mounted() {
        const storage = localStorage.getItem("financas")
        if(storage !== null) {
            this.calculate(storage)      
        }
    }
}

createApp(App)
    .use(primevue.config.default)
    .use(primevue.toastservice)
    .use(primevue.confirmationservice)
    .mount("#app")