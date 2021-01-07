const Keyboard = {
    elements:{
        main:null,
        keysContainer:null,
        keys:[]
    }, 

    eventHandlers:{
        oninput:null,
        onclose:null
    },

    properties:{
        value:'',
        capslock:false
    },

    init(){

        //create main elements
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        //setup main elements
        this.elements.main.classList.add('keyboard', 'keyboard__hidden');  //we added a number at the beggining of the class first, so that the hidden class stays inactive for now
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');  //all of the keys we created in the _createKey function are now stored as a nodeList type of array inside the keys array. we did this for activating the caps later.
             //this.elements.keys = document.querySelectorAll('.keyboard__key');  why not this???

        //add to the dom
        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        // Automatically use keyboard for elements with .use-keyboard-input
        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                });
            });
        });
    },

    _createKeys(){     //it is going to return a document fragment => virtual elements that you can use to append other elements to, and then you append the whole fragment to a different element
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
            "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
            "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
            "done", "z", "x", "c", "v", "b", "n", "m", ",", ".", "?",
            "space"
        ];

        //creates HTML for an icon
        const createIconHTML = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key =>{
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace','p','enter','?'].indexOf(key) !== -1;
           
            //add attributes/classes
            keyElement.setAttribute('type','button');
            keyElement.classList.add('keyboard__key');
            

            switch(key){
                case 'backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHTML('backspace');

                    keyElement.addEventListener('click', () =>{
                        this.properties.value = this.properties.value.substring(0 , this.properties.value.length -1);

                        this._triggerEvent('oninput');   //because the input has changed, we have to notify the code using the keyboard that the input has changed.
                    });
                    break;
                
                case 'caps':
                    keyElement.classList.add('keyboard__key--wide' , 'keyboard__key--activatable');
                    keyElement.innerHTML = createIconHTML('keyboard_capslock');

                    keyElement.addEventListener('click', () =>{
                        this._toggleCapslock();
                        keyElement.classList.toggle('keyboard__key--active',this.properties.capslock);  
                    });
                    break;    

                case 'enter':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.innerHTML = createIconHTML('keyboard_return');
    
                    keyElement.addEventListener('click', () =>{
                    this.properties.value += '\n';    //line break, which will change the input as well'
                    this._triggerEvent('oninput');
                    });
                    break;   
                
                case 'space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.innerHTML = createIconHTML('space_bar');
        
                    keyElement.addEventListener('click', () =>{
                    this.properties.value += ' ';    
                    this._triggerEvent('oninput');
                    });
                    break;   
                    
                case 'done':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
                    keyElement.innerHTML = createIconHTML('check_circle');
        
                    keyElement.addEventListener('click', () =>{  
                    this.close();     
                    this._triggerEvent('onclose');
                    });
                    break;   
                    
                default:
                    keyElement.textContent = key.toLowerCase();   //in case you have entered one of the layouts in caps mode by mistake.
            
                    keyElement.addEventListener('click', () =>{  
                    this.properties.value += this.properties.capslock ? key.toUpperCase():key.toLowerCase();    
                    this._triggerEvent('oninput');
                    });
                    break;         
            }
           

            fragment.appendChild(keyElement);

            if(insertLineBreak){     
                fragment.appendChild(document.createElement('br'));
            }

        });

        return fragment;     //now we append the returning fragment(the whole function) to the keysContainer (up)
    },

    _triggerEvent(handlerName){
        if(typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapslock(){
        this.properties.capslock = !this.properties.capslock;     //set the capslock property to be opposite of what already is

        for(const key of this.elements.keys){
            if(key.childElementCount === 0){    //if the key doesn't have any icon
                key.textContent = this.properties.capslock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }

    },

    open(initialValue, oninput, onclose){
       this.properties.value = initialValue || "";
       this.eventHandlers.oninput = oninput;
       this.eventHandlers.onclose = onclose;

       this.elements.main.classList.remove('keyboard__hidden');
    },

    close(){
        this.properties.value = "";
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard__hidden');

    }

};

window.addEventListener('DOMContentLoaded', function(){

    Keyboard.init();

    /*
    keyboard.open('dcode', function(currentValue){
        console.log(`value changed! here it is : ${currentValue}`);
    }, function(currentValue){
        console.log(`keyboard closed! finishing value : ${currentValue}`);
    });
    */
});