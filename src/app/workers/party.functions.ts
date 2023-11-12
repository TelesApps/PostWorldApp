import { Party } from "../interfaces/party.interface";
import { Region } from "../interfaces/regions.interface";
import { Resource } from "../interfaces/resource.interface";

export class PartyActions {
    static updatePartyPerSecond = updatePartyPerSecond;
    static updatePartyPerThirtySeconds = updatePartyPerThirtySeconds;
    static updatePartyPerNinetySeconds = updatePartyPerNinetySeconds;
}


// EVERY SECOND
function updatePartyPerSecond(party: Party, allRegions?: Region[], resourceLibrary?: Resource[]) {
    partyEats(party, resourceLibrary);
    if(party.activity === 'exploring') {
        
    }
}

// EVERY 30 SECONDS
function updatePartyPerThirtySeconds(party: Party) {

}

// EVERY 90 SECONDS
function updatePartyPerNinetySeconds(party: Party) {

}

// PRIVATE FUNCTIONS BELLOW
function partyEats(party: Party, resourceLibrary: Resource[]) {
    console.log('partyEats called');
    let hasFood = true;
    if(party.resources && party.resources.length > 0) {
        // get name_id of all possible resources that is of type food
        const foodResourceNameIds = resourceLibrary.filter(resource => resource.resource_type === 'food').map(resource => resource.name_id);
        // find the first resource that is of type food in party resources
        const foodResource = party.resources.find(resource => foodResourceNameIds.includes(resource.name_id));
        //for each colonist in party, consume food
        party.colonists.forEach(colonist => {
            if(foodResource && foodResource.amount > 0) {
                foodResource.amount -= 1;
                colonist.food += 0.2;
            } else {
                colonist.food -= 0.1;
            }
            if(colonist.food <= 0) {
                colonist.food = 0;
                // #TODO add logic to update his healthstatus to starving
            }
        });
    } else {
        hasFood = false;
    }
}