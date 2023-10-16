import { Colonist } from "../interfaces/colonist.interface";
import { Colony } from "../interfaces/colony.interface";

export function updateColonistPerSecond(colonist: Colonist, colony?: Colony) {
    colonist.food -= 0.1;
    // Figure out if colonist is in a party or not
    if(colonist.assigned_party_id) {
        // #TODO figure out how to handle food and party logic
    } else {
        // Add logic here to extract a food type resource from the colony
        
        // If no food type resource is found, asjust colonist food level
        if(true) {
            colonist.food -= 0.1;
        }
    }
}

export function updateColonistPerThirtySeconds(colonist: Colonist) {

}