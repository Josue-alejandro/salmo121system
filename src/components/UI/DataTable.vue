<template>
    <div class="titleDiv">
        <h5>{{ title }}</h5>
    </div>
    <div class="tableDiv">
        <div class="botones">
            <button class="btn blue darken-1" @click="$emit('add')">
                <i class="material-icons">add</i>
            </button>
            <button class="btn red darken-4" @click="$emit('delete', selectedItems)">
                <i class="material-icons">delete</i>
            </button>
            <div class="input-field col s6" v-if="searchable">
                <input 
                type="text" 
                class="validate"
                v-model="searchQuery"
                placeholder="Buscar...">
            </div>
        </div>
        <Transition>
            <div class="tableContainer" v-if="!loading">
                <table>
                    <thead>
                        <tr>
                            <th v-for="column in columns" :key="column.key" @click="sortable ? sortByProperty(column.key) : null" 
                                class="headerTable">
                                {{ column.label }}
                            </th>
                            <th>Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in filteredItems" :key="item.id" 
                            :class="{ selected: selectedItems.includes(item.id), rowNormal: true }" 
                            @click="toggleSelection(item.id)">
                            <td v-for="column in columns" :key="column.key">{{ item[column.key] }}</td>
                            <td class="editTd">
                                <i class="material-icons" @click="$emit('edit', item)">edit</i>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-else>
                <div class="loading">
                    <i class="material-icons loadingIcon">hourglass_empty</i>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
    props: {
        title: String,
        columns: Array,
        data: Array,
        loading: Boolean,
        searchable: Boolean,
        sortable: Boolean
    },
    emits: ['edit', 'delete', 'add'],
    setup(props) {
        const searchQuery = ref('');
        const selectedItems = ref([]);
        const currentSortProperty = ref('');
        const sortOrder = ref('asc');  // 'asc' o 'desc'

        const filteredItems = computed(() => {
            let items = [...props.data]; // Copiamos los datos para no mutarlos directamente

            if (searchQuery.value) {
                items = items.filter(item => 
                    Object.values(item).some(value => 
                        String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
                    )
                );
            }

            // Aplicamos la ordenación si es necesario
            if (currentSortProperty.value) {
                items.sort((a, b) => {
                    let valueA = a[currentSortProperty.value];
                    let valueB = b[currentSortProperty.value];

                    if (typeof valueA === "number" && typeof valueB === "number") {
                        return sortOrder.value === 'asc' ? valueA - valueB : valueB - valueA;
                    }

                    if (typeof valueA === "string" && typeof valueB === "string") {
                        return sortOrder.value === 'asc' 
                            ? valueA.localeCompare(valueB) 
                            : valueB.localeCompare(valueA);
                    }

                    return 0;
                });
            }

            return items;
        });

        const sortByProperty = (property) => {
            if (currentSortProperty.value === property) {
                sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
            } else {
                sortOrder.value = 'desc';
                currentSortProperty.value = property;
            }
        };

        const toggleSelection = (id) => {
            const index = selectedItems.value.indexOf(id);
            if (index === -1) {
                selectedItems.value.push(id);
            } else {
                selectedItems.value.splice(index, 1);
            }
        };

        return {
            searchQuery,
            selectedItems,
            filteredItems,
            sortByProperty,
            toggleSelection
        };
    }
};
</script>
