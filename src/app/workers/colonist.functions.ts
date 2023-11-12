import { Colonist } from "../interfaces/colonist.interface";
import { Colony } from "../interfaces/colony.interface";

export class ColonistActions {
    static updateColonistPerSecond = updateColonistPerSecond;
    static updateColonistPerThirtySeconds = updateColonistPerThirtySeconds;
    static updateColonistPerNinetySeconds = updateColonistPerNinetySeconds;
}
// EVERY SECOND
function updateColonistPerSecond(colonist: Colonist, colony?: Colony) {
    updateAge(colonist);
    colonistEats(colonist, colony);
}

// EVERY 30 SECONDS
function updateColonistPerThirtySeconds(colonist: Colonist) {

}

// EVERY 90 SECONDS
function updateColonistPerNinetySeconds(colonist: Colonist) {

}

// PRIVATE FUNCTIONS BELLOW

function colonistEats(colonist: Colonist, colony: Colony) {
    // Figure out if colonist is in a party or not
    if (colonist.assigned_party_id) {
        // Party logic handles food consumption nothing else goes here
    } else {
        // Add logic here to extract a food type resource from the colony

        // If no food type resource is found, adjust colonist food level
        colonist.food -= 0.1;
    }
    if (colonist.food < 0) colonist.food = 0;
}

function updateAge(colonist: Colonist) {
    colonist.age++;
}
