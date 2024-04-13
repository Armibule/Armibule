const playgrounds = document.getElementsByClassName("binaryLogicPlayground");


const playgroundHtml = `
<div class="playgroundLeftPannel">
    <div class="playgroundChoiceCategory">
        <span>Portes 1 bit</span>

        <div class="playgroundChoices">
            <div class="playgroundChoice" gate="AndGate">
            </div>
            <div class="playgroundChoice" gate="OrGate">
            </div>
            <div class="playgroundChoice" gate="NotGate">
            </div>
            <div class="playgroundChoice" gate="NandGate">
            </div>
            <div class="playgroundChoice" gate="NorGate">
            </div>
            <div class="playgroundChoice" gate="XorGate">
            </div>
        </div>
    </div>
    
    <div class="playgroundChoiceCategory">
        <span>Entrées</span>
    
        <div class="playgroundChoices">
            <div class="playgroundChoice" gate="OneBitInput">
            </div>
            <div class="playgroundChoice">
            </div>
            <div class="playgroundChoice">
            </div>
        </div>
    </div>
    
    <div class="playgroundChoiceCategory">
        <span>Affichages</span>
    
        <div class="playgroundChoices">
            <div class="playgroundGateChoice">
            </div>
            <div class="playgroundGateChoice">
            </div>
            <div class="playgroundGateChoice">
            </div>
        </div>
    </div>
</div>

<svg class="oneBitConnectorFabric" xmlns="http://www.w3.org/2000/svg" style="display: none;"><path class="oneBitConnector" d="M0 0a2.457 2.457 0 114.915 0A2.457 2.457 0 010 0z" fill="#333" stroke="#4d4d4d"/></svg>
<svg xmlns="http://www.w3.org/2000/svg" class="playgroundField"></svg>
`

var update = null;

playgrounds.forEach((playground) => {
    playground.innerHTML = playgroundHtml;

    var playgroundField = playground.querySelector(".playgroundField");
    playgroundFieldScale = 0.65;
    playground.addingGate = null;
    playground.movingGate = null;
    playground.addingWire = null;

    playground.grabOffsetX = 0;
    playground.grabOffsetY = 0;

    playground.snapGridEnabled = true;
    playground.snapGridSize = 12;

    oneBitConnectorFabric = playground.querySelector(".oneBitConnectorFabric");

    if (playground.snapGridEnabled) {
        playground.style.backgroundImage = 
        "linear-gradient(transparent 70%, color-mix(in srgb, transparent 70%, var(--primaryTop)) 70%)," +
        "linear-gradient(90deg, transparent 70%, color-mix(in srgb, transparent 70%, var(--primaryTop)) 70%)";
        playground.style.backgroundSize = `${playground.snapGridSize/playgroundFieldScale}px ${playground.snapGridSize/playgroundFieldScale}px`;
    }


    objectsSet = new Set();    // all objects flattened
    gateObjects = new Set();   // all gate objects


    class Wire {

        /**
        * @param {Connector} connector1
        * @param {Connector} connector2
        */
        constructor(element, connector1, connector2=null, state=false) {
            this.element = element;

            this.conn1 = connector1;
            this.conn2 = connector2;
            
            this.state = state;
        }
    
        propagateState(state) {
            // has already propagated signal
            if (this.state) {
                return;
            }
            if (state) {
                this.state = true;

                if (this.conn1 != null) {
                    this.conn1.propagateState(this.state);
                }
                if (this.conn2 != null) {
                    this.conn2.propagateState(this.state);
                }
            }
        }
        updateElement() {
            if (this.state) {
                this.element.classList.add("activated");
            } else {
                this.element.classList.remove("activated");
            }
        }
        /*walkBack() {
            if (this.conn1.visited) {
                return this.conn2.walkBack();
            } else {
                return this.conn1.walkBack();
            }
        }*/
    }
    class Connector {
    
        static INPUT_CONNECTOR = 0;
        static OUTPUT_CONNECTOR = 1;
        static INDEPENDANT_CONNECTOR = 2;
    
        /**
        * @param {Number} type
        * @param {Gate} gate
        * @param {boolean} state
        */
        constructor(element, type, gate=false, state=false) {
            this.element = element;

            this.gate = gate;
            this.type = type;
            this.wires = new Set();

            this.state = state;
        }
    
        addWire(wire) {
            this.wires.add(wire);
        }
    
        propagateState(state) {
            // has already propagated signal
            if (this.state) {
                return;
            }
            if (state) {
                this.state = true;

                if (this.type != Connector.INPUT_CONNECTOR) {
                    this.wires.forEach((wire) => {
                        wire.propagateState(this.state);
                    });
                }
            }
        }
        updateElement() {
            if (this.state) {
                this.element.classList.add("activated");
            } else {
                this.element.classList.remove("activated");
            }
        }
    }
    class Gate {
    
        static AND_GATE = 0;
        static OR_GATE = 1;
        static NOT_GATE = 2;
        static NAND_GATE = 3;
        static NOR_GATE = 4;
        static XOR_GATE = 5;
        static CONSTANT_ON = 6;
        static CONSTANT_OFF = 7;
    
        /**
        * @param {Number} type
        * @param {Set[Connector]} gate
        * @param {Set[Connector]} isInput
        */
        constructor(element, type, inputConnectors=null, outputConnectors=null) {
            this.element = element;

            this.type = type;
            if (inputConnectors == null) {
                this.inputConns = new Set();
            } else {
                this.inputConns = inputConnectors;
            }
            if (outputConnectors == null) {
                this.outputConns = new Set();
            } else {
                this.outputConns = outputConnectors;
            }

            this.state = false;
        }
    
        addInputConn(inputConn) {
            this.inputConns.add(inputConn);
        }
        addOutputConn(outputConn) {
            this.outputConns.add(outputConn);
        }

        updateState() {
            let inputStates = [];
            this.inputConns.forEach((conn) => {
                inputStates.push(conn.state);
            });

            console.log(this)

            switch (this.type) {
                case Gate.AND_GATE:
                    this.state = inputStates[0] && inputStates[1];
                    break;
                case Gate.OR_GATE:
                    this.state = inputStates[0] || inputStates[1];
                    break;
                case Gate.NOT_GATE:
                    this.state = !inputStates[0];
                    break;
                case Gate.NAND_GATE:
                    this.state = !(inputStates[0] && inputStates[1]);
                    break;
                case Gate.NOR_GATE:
                    this.state = !(inputStates[0] || inputStates[1]);
                    break;
                case Gate.XOR_GATE:
                    this.state = inputStates[0] ^ inputStates[1];
                    break;
                case Gate.CONSTANT_ON:
                    this.state = true;
                    console.log(this)
                    break;
                case Gate.CONSTANT_OFF:
                    this.state = false;
                    console.log(this)
                    break;
                default:
                    break;
            }
        }
    
        propagateState() {
            if (this.state) {
                this.outputConns.forEach((conn) => {
                    conn.propagateState(this.state);
                });
            }
        }
        updateElement() {
            if (this.state) {
                this.element.classList.add("activated");
            } else {
                this.element.classList.remove("activated");
            }
        }
    }

    gateNameToObjectType = {
        "AndGate": Gate.AND_GATE,
        "NandGate": Gate.NAND_GATE,
        "NorGate": Gate.NOR_GATE,
        "NotGate": Gate.NOT_GATE,
        "OneBitInput": Gate.CONSTANT_OFF,
        "OrGate": Gate.OR_GATE,
        "XorGate": Gate.XOR_GATE
    }

    function updateObjects(doUpdateElement=true) {
        starterConns = new Set();

        gateObjects.forEach((gateObject) => {
            gateObject.updateState();
        });

        objectsSet.forEach((object) => {
            if (!(object instanceof Gate)) {
                object.state = false;
            }
        });

        gateObjects.forEach((gateObject) => {
            gateObject.propagateState();
        });

        if (doUpdateElement) {
            objectsSet.forEach((object) => {
                object.updateElement();
            });
        }
    }

    // FOR DEBUG
    update = updateObjects;
    // FOR DEBUG


    new ResizeObserver(() => {
        let playgroundFieldRect = playgroundField.getBoundingClientRect();

        playgroundField.setAttribute("viewBox", `0 0 ${playgroundFieldRect.width * playgroundFieldScale} ${playgroundFieldRect.height * playgroundFieldScale}`);
    }).observe(playgroundField);


    function snapCoord(x) {
        if (playground.snapGridEnabled) {
            return Number.parseInt(x/playground.snapGridSize) * playground.snapGridSize
        } else {
            return x;
        }
    }

    function getPlaygroundPos(event, element, scaled=true, useElementRect=true) {
        var playgroundRect = playground.getBoundingClientRect();

        if (useElementRect) {
            var elementRect = element.getBoundingClientRect();
        }

        if (scaled) {
            if (useElementRect) {
                return [(event.clientX - playgroundRect.x - playground.grabOffsetX) * playgroundFieldScale, 
                        (event.clientY - playgroundRect.y - playground.grabOffsetY) * playgroundFieldScale];
            } else {
                return [(event.clientX - playgroundRect.x) * playgroundFieldScale, 
                        (event.clientY - playgroundRect.y) * playgroundFieldScale];
            }
        } else {
            if (useElementRect) {
                return [event.clientX - playgroundRect.x - elementRect.width/2, 
                        event.clientY - playgroundRect.y - elementRect.height/2];
            } else {
                return [event.clientX - playgroundRect.x, 
                        event.clientY - playgroundRect.y];
            }
        }
    }
    function getElementPos(element, scaled=true) {
        var playgroundRect = playground.getBoundingClientRect();
        var elementRect = element.getBoundingClientRect();

        if (scaled) {
            return [(elementRect.x - playgroundRect.x + elementRect.width/2) * playgroundFieldScale, 
                    (elementRect.y - playgroundRect.y + elementRect.height/2) * playgroundFieldScale];
        } else {
            return [elementRect.x - playgroundRect.x + elementRect.width/2, 
                    elementRect.y - playgroundRect.y + elementRect.height/2];
        }
    }

    playground.querySelectorAll(".playgroundChoiceCategory > span").forEach((categoryButton) => {
        let parent = categoryButton.parentElement;
        categoryButton.onclick = function() {
            if (parent.classList.contains("expended")) {
                parent.classList.remove("expended");
            } else {
                parent.classList.add("expended");
            }
        }
    });

    playground.getElementsByClassName("playgroundChoice").forEach((choice) => {
        choice.onmousedown = function(event) {
            if (playground.addingGate != null) {
                playground.addingGate.remove();
            }

            let addingGate = choice.cloneNode(true);

            playground.addingGate = addingGate;

            addingGate.classList.remove("playgroundChoice");
            addingGate.classList.add("addingGate");

            addingGate.style.scale = 1 / playgroundFieldScale;

            let [x, y] = getPlaygroundPos(event, addingGate, false);
            addingGate.style.left = `${snapCoord(x)}px`;
            addingGate.style.top = `${snapCoord(y)}px`;

            playground.appendChild(addingGate);
        }
    });

    playground.getElementsByClassName("playgroundChoice").forEach((choice) => {
        choice.innerHTML = logicAssets[choice.getAttribute("gate")];
    });

    playground.addEventListener("mousemove", (event) => {
        if (playground.addingGate != null) {
            let [x, y] = getPlaygroundPos(event, playground.addingGate, false, false);
            playground.addingGate.style.left = `${snapCoord(x)}px`;
            playground.addingGate.style.top = `${snapCoord(y)}px`;
        }
    });

    playground.addEventListener("mouseup", (event) => {
        if (playground.addingGate != null) {
            var gate = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            gate.setAttribute("gate", playground.addingGate.getAttribute("gate"));

            // transfer children
            while (playground.addingGate.firstChild.childNodes.length) {
                gate.appendChild(playground.addingGate.firstChild.firstChild); 
            }

            gate.x = 0;
            gate.y = 0;

            /* 1 bit input */
            if (gate.getAttribute("gate") == "OneBitInput") {
                gate.onclick = function() {
                    if (gate.classList.contains("enabled")) {
                        gate.classList.remove("enabled");
                        gate.querySelector("tspan").textContent = "0";
                        gate.object.type = Gate.CONSTANT_OFF;
                    } else {
                        gate.classList.add("enabled");
                        gate.querySelector("tspan").textContent = "1";
                        gate.object.type = Gate.CONSTANT_ON;
                    }
                }
            }

            gate.connectors = gate.getElementsByClassName("oneBitConnector");

            gate.connectors.forEach((connector) => {
                connector.wireStarts = [];
                connector.wireEnds = [];
            });


            /* object creation */

            let gateObject = new Gate(gate, gateNameToObjectType[gate.getAttribute("gate")]);

            gate.connectors.forEach((conn) => {
                if (conn.classList.contains("inputConnector")) {
                    connObject = new Connector(conn, Connector.INPUT_CONNECTOR, gateObject);
                    gateObject.addInputConn(connObject);
                } else {
                    connObject = new Connector(conn, Connector.OUTPUT_CONNECTOR, gateObject);
                    gateObject.addOutputConn(connObject);
                }
                conn.object = connObject;
                objectsSet.add(connObject);
            });

            objectsSet.add(gateObject);
            gateObjects.add(gateObject);
            gate.object = gateObject;

            addingGateRect = playground.addingGate.getBoundingClientRect();
            playground.grabOffsetX = event.clientX - addingGateRect.x - playground.snapGridSize - 1;
            playground.grabOffsetY = event.clientY - addingGateRect.y - playground.snapGridSize - 1;
            moveGate(event, gate);
            playground.grabOffsetX = 0;
            playground.grabOffsetY = 0;

            playgroundField.appendChild(gate);

            playground.addingGate.remove();
            playground.addingGate = null;
        }
    });

    function getGrabbed(event) {
        let target = event.target;
        if (target != playgroundField) {
            while (target.parentElement != playgroundField && !target.classList.contains("oneBitConnector")) {
                target = target.parentElement;
            }

            return target;
        }
        return null;
    }

    function updateWire(wire) {
        // wire.setAttributeNS(null, "d", `M${wire.startX},${wire.startY}C${(wire.startX*0.5+wire.endX*1.5)/2},${wire.startY},${(wire.startX*1.5+wire.endX*0.5)/2},${wire.endY},${wire.endX},${wire.endY}`); 
        wire.setAttributeNS(null, "d", `M${wire.startX},${wire.startY}C${wire.startX + Math.abs(wire.startX - wire.endX)/3 + 20},${(wire.startY*1.5 + wire.endY*0.5)/2},${wire.endX - Math.abs(wire.startX - wire.endX)/3 - 20},${(wire.startY*0.5 + wire.endY*1.5)/2},${wire.endX},${wire.endY}`); 
    }

    playgroundField.addEventListener("mousedown", (event) => {
        let target = getGrabbed(event);

        // create a wire from nowhere
        if (target == null) {
            let wire = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            let connector = oneBitConnectorFabric.cloneNode(true).firstChild;
            connector.wireStarts = [wire];
            connector.wireEnds = [];
            moveGate(event, connector);

            let [x, y] = getPlaygroundPos(event, connector);

            wire.startX = snapCoord(x);
            wire.startY = snapCoord(y);
            wire.endX = snapCoord(x);
            wire.endY = snapCoord(y);

            updateWire(wire);

            wire.setAttributeNS(null, "stroke", "var(--primaryTop)"); 
            wire.setAttributeNS(null, "stroke-width", 6);  
            wire.setAttributeNS(null, "stroke-linecap", "round");
            wire.setAttributeNS(null, "fill", "none");

            wire.classList.add("wire");

            wire.connector1 = connector;
            wire.connector2 = null;

            /* object creation */
            connector.object = new Connector(connector, Connector.INDEPENDANT_CONNECTOR);
            objectsSet.add(connector.object);

            let wireObject = new Wire(wire, connector.object);
            connector.object.addWire(wireObject);
            wireObject.conn1 = connector.object;
            wire.object = wireObject;
            objectsSet.add(wireObject);

            playground.addingWire = wire;

            playgroundField.appendChild(connector);
            // makes is behind
            playgroundField.insertBefore(wire, playgroundField.firstChild);

        } else if (target.classList.contains("oneBitConnector")) {
            let wire = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            let [x, y] = getElementPos(target);

            wire.startX = x;
            wire.startY = y;
            wire.endX = snapCoord(x);
            wire.endY = snapCoord(y);

            updateWire(wire);

            // wire.setAttributeNS(null, "d", "M0,0c50,0,50,100,100,100");  

            wire.setAttributeNS(null, "stroke", "var(--primaryTop)"); 
            wire.setAttributeNS(null, "stroke-width", 6);  
            wire.setAttributeNS(null, "stroke-linecap", "round");
            wire.setAttributeNS(null, "fill", "none");

            wire.classList.add("wire");

            wire.connector1 = target;
            wire.connector2 = null;
            target.wireStarts.push(wire);

            /* object creation */
            let wireObject = new Wire(wire, target.object);
            target.object.addWire(wireObject);
            wire.object = wireObject;
            objectsSet.add(wireObject);

            playground.addingWire = wire;

            // makes is behind
            playgroundField.insertBefore(wire, playgroundField.firstChild);


        } else if (target.classList.contains("wire")) {
            // add a connector to a wire

            let wire = document.createElementNS('http://www.w3.org/2000/svg', 'path');

            let connector = oneBitConnectorFabric.cloneNode(true).firstChild;
            connector.wireStarts = [wire];
            connector.wireEnds = [target];
            moveGate(event, connector);

            let [x, y] = getPlaygroundPos(event, connector);

            wire.startX = snapCoord(x);
            wire.startY = snapCoord(y);
            wire.endX = target.endX;
            wire.endY = target.endY;

            target.endX = snapCoord(x);
            target.endY = snapCoord(y);

            updateWire(wire);
            updateWire(target);

            wire.setAttributeNS(null, "stroke", "var(--primaryTop)"); 
            wire.setAttributeNS(null, "stroke-width", 6);  
            wire.setAttributeNS(null, "stroke-linecap", "round");
            wire.setAttributeNS(null, "fill", "none");

            wire.classList.add("wire");

            wire.connector1 = connector;
            wire.connector2 = target.connector2;

            /* object creation */
            connector.object = new Connector(connector, Connector.INDEPENDANT_CONNECTOR);
            objectsSet.add(connector.object);

            let wireObject = new Wire(wire, connector.object);
            
            connector.object.addWire(wireObject);
            target.connector2.object.addWire(wireObject);
            
            wireObject.conn1 = connector.object;
            wireObject.conn2 = target.connector2.object;

            wire.object = wireObject;
            objectsSet.add(wireObject);


            target.connector2.object.wires.delete(target.object);
            target.connector2 = connector;
            target.object.conn2 = connector.object;

            playgroundField.appendChild(connector);
            // makes is behind
            playgroundField.insertBefore(wire, playgroundField.firstChild);
        } else if (target.getAttribute("gate") != null) {
            target.classList.add("movingGate");
            playgroundField.appendChild(target); // puts it on top

            playground.movingGate = target;

            var gateRect = target.getBoundingClientRect();

            playground.grabOffsetX = event.clientX - gateRect.x - playground.snapGridSize - 1;
            playground.grabOffsetY = event.clientY - gateRect.y - playground.snapGridSize - 1;

            moveGate(event, playground.movingGate);
        }
    });

    function moveGate(event, element) {
        let [x, y] = getPlaygroundPos(event, element);
        x = snapCoord(x);
        y = snapCoord(y);
        element.setAttribute("transform", `translate(${x}, ${y})`);

        if (element.getAttribute("gate") != null) {
            element.connectors.forEach((connector) => {
                connector.wireStarts.forEach((wire) => {
                    wire.startX += x - element.x;
                    wire.startY += y - element.y;
                    updateWire(wire);
                });
                connector.wireEnds.forEach((wire) => {
                    wire.endX += x - element.x;
                    wire.endY += y - element.y;
                    updateWire(wire);
                });
            });
        } else if (element.classList.contains("oneBitConnctor")) {
            connector.wireStarts.forEach((wire) => {
                wire.startX += x - element.x;
                wire.startY += y - element.y;
                updateWire(wire);
            });
            connector.wireEnds.forEach((wire) => {
                wire.endX += x - element.x;
                wire.endY += y - element.y;
                updateWire(wire);
            });
        }

        element.x = x;
        element.y = y;
    }

    playgroundField.addEventListener("mouseup", (event) => {
        if (playground.movingGate != null) {
            playground.movingGate.classList.remove("movingGate");

            moveGate(event, playground.movingGate);

            playground.movingGate = null;
            playground.grabOffsetX = 0;
            playground.grabOffsetY = 0;
        }
        if (playground.addingWire != null) {
            let target = getGrabbed(event);

            if (target != null && target.classList.contains("oneBitConnector")) {
                playground.addingWire.object.conn2 = target.object;

                playground.addingWire.connector2 = target;
                let [x, y] = getElementPos(target);
                playground.addingWire.endX = x;
                playground.addingWire.endY = y;
                updateWire(playground.addingWire);

                target.wireEnds.push(playground.addingWire);
            } else {
                let connector = oneBitConnectorFabric.cloneNode(true).firstChild;

                connector.wireStarts = [];
                connector.wireEnds = [playground.addingWire];

                /* object creation */
                connector.object = new Connector(connector, Connector.INDEPENDANT_CONNECTOR);
                objectsSet.add(connector.object);
                
                playground.addingWire.connector2 = connector;
                playground.addingWire.object.conn2 = connector.object;

                moveGate(event, connector);

                playgroundField.appendChild(connector);
            }

            playground.addingWire = null;
        }
    });

    playgroundField.addEventListener("mousemove", (event) => {
        if (playground.movingGate != null) {
            moveGate(event, playground.movingGate);
        }
        if (playground.addingWire != null) {
            let [x, y] = getPlaygroundPos(event, null, true, false);

            playground.addingWire.endX = snapCoord(x);
            playground.addingWire.endY = snapCoord(y);

            updateWire(playground.addingWire);
        }
    });

    function updateClock() {
        /* Fast mode ?
        for (i=0 ; i<4 ; i++) 
            updateObjects(true);*/

        updateObjects(true);

        setTimeout(updateClock, 200);
    }

    updateClock();
});