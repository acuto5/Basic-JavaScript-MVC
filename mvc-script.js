function View(controller, scope){
    this.controller = controller;
    this.heading = scope.querySelector(".heading");
    this.heading.addEventListener('click', controller);
    this.update = function(data){
        this.heading.innerText = data.heading;
    };
    this.controller.model.registerObserver(this);
}

function Model(){
    var self = this;
    var heading = "Hello";
    //collection of observers
    this.observers = [];
    //add to the collection of observers
    this.registerObserver = function(observer){
        self.observers.push(observer);
    };
    //Iterate over observers, calling their update method
    this.notifyAll = function(){
        self.observers.forEach(function(observer){
            observer.update(self);
        })
    };

    Object.defineProperty(this,"heading",{
        get: function() { return heading; },
        set: function(value) {
            heading = value;
            //call notifyAll in the assignment function
            this.notifyAll();
        }
    });
}

function Controller(model){
    var self = this;
    this.model = model;
    //EVENTLISTENER INTERFACE
    this.handleEvent = function(e){
        e.stopPropagation();
        switch(e.type){
            case "click":
                self.clickHandler(e.target);
                break;
            default:
                console.log(e.target);
        }
    };
    //GET MODEL HEADING
    this.getModelHeading = function(){
        return self.model.heading;
    };
    //CHANGE THE MODEL
    this.clickHandler = function(target){
        self.model.heading = 'World';
    };

    this.init = function () {
        self.model.notifyAll();
    };
}

function main(){
    var model = new Model();
    var controller = new Controller(model);
    var viewOne = new View(controller, document.getElementById('app-one'));
    var viewTwo = new View(controller, document.getElementById('app-two'));

    controller.init();
}

window.addEventListener('load', main);
