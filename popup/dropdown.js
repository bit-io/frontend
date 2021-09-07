export default class Dropdown {
    checkedItems = []

    constructor(config) {
        const { rootElement, type, options, params } = config

        this.rootElement = rootElement
        this.options     = options 
        this.openedIcon  = params.openedIcon
        this.optionList  = params.optionsContainer.list
        this.opened      = params.optionsContainer.opened
        this.selectedOptionsCount  = params.selectedOptionsCount
        this.render  = params.render
        this.onClickElement = rootElement.querySelector(type)
        this.dropdownListElement = this.onClickElement.querySelector(params.dropdownList)
        this.queryInput = params.queryInput
        this.selectedOptionsCountElement = this.onClickElement.querySelector(this.selectedOptionsCount)
    }

    _openList () {
        this.onClickElement.addEventListener('click', (event) => {
            event.stopPropagation()

            
            let openedDropdownElement = event.currentTarget.querySelector(this.optionList)

            if (this._isOpenedDropdown(this.opened, event)) {
                openedDropdownElement.classList.remove(this.opened) 
                event.currentTarget.classList.remove(this.openedIcon)
            } else { 
                this._closedAllDropdown(this.opened)
                this._closedDropdown(openedDropdownElement, this.opened)

                openedDropdownElement.classList.add(this.opened) 
                event.currentTarget.classList.add(this.openedIcon)
            }
        })

        this._onChangeCounter()
    }

    /**
     * @return {boolean}
     */
    _isOpenedDropdown(opened, event) {
        return event.currentTarget.contains(document.querySelector(`.${opened}`)) && !event.target.closest(`.${opened}`)
    }

    _onChangeCounter(selectedOptionsCountElement) {
        this.dropdownListElement.addEventListener('change', e => {
            e.stopPropagation()

            const checked = e.target.checked
            const id      = e.target.id

            if (checked && !this.checkedItems.includes(id)) {
                this.checkedItems.push(id)
            } else {
                this.checkedItems = this.checkedItems.filter(i => i !== id)
            }
            
            this.selectedOptionsCountElement.innerHTML = this._countCheckedItems()
        })
    }

    /**
     * Closed dropdown
     */
    _closedDropdown(openedDropdownElement, opened) {
        let listenClickOutside = (event) => {
            event.stopPropagation()

            if (openedDropdownElement && !event.target.closest(openedDropdownElement.className)) {
                openedDropdownElement.classList.remove(opened)		
            }  
            
            document.removeEventListener('click', listenClickOutside)
        }

        document.addEventListener('click', listenClickOutside)
    }

    /**
     * Closed all dropdown
     * 
     * @returns {array}
     */
    _closedAllDropdown(opened) {
        return  document.querySelectorAll(`.${ this.opened }`).forEach((field) => field.classList.remove(opened))
    }

    /**
     * Render items
     * 
     * @param {callback} callback Render DOM
     */
    renderList(callback) {
        this._openList()
        
        if (typeof this.queryInput !== 'undefined') { 
            this._find(this.onClickElement.querySelector(this.queryInput)) 
        }   

        this.renderCallbackList = callback
        this._render()
    }

    _render() {
        this.dropdownListElement.innerHTML = this.renderCallbackList(this, this.filteredOptions ? this.filteredOptions : this.options) 
    }

    /**
     * Filtered items by finded value
     * 
     * @return 
     */
    _find(queryInput) {
        queryInput.addEventListener('input', (event) => {
            event.stopPropagation()
            
            const queryInput = event.target.value.trim().toLowerCase()
            const query = `^${queryInput}`
            this.filteredOptions = this.options.filter(item => item.name.trim().toLowerCase().search(query) !== -1)

            this._render() 
        })
    }

    /**
     * Count items in array 
     * 
     * @returns {integer|null}
     */
    _countCheckedItems() {
        return (this.checkedItems.length) ? this.checkedItems.length : null
    }
}