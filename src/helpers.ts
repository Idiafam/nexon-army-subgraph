import { Address, Bytes, BigInt } from "@graphprotocol/graph-ts";
import { Owner, VotingWeight } from "../generated/schema";
import {
    NexonArmyNFT as NexonArmyContract,
} from '../generated/NexonArmyNFT/NexonArmyNFT';
let NEXON_ARMY_NFT_CONTRACT = Address.fromString(
    "0x8F2916F9Ed3a44Cb7A8db2A7566A56cDB2dbb874"
)
export let nexonArmyContract = NexonArmyContract.bind(
    NEXON_ARMY_NFT_CONTRACT
);

let SERGEANT_RANK = BigInt.fromI32(4);
let CORPORAL_RANK = BigInt.fromI32(5);

let SERGEANT_POWER = BigInt.fromI32(250);
let CORPORAL_POWER = BigInt.fromI32(60);
let SOLDIER_POWER = BigInt.fromI32(5);

export function createOwner(address: Bytes): void {
    let ownerAddress = address.toHexString();

    let owner = Owner.load(ownerAddress);

    if (owner == null) {
        owner = new Owner(ownerAddress);
        owner.address = address;
        owner.votingWeight = BigInt.fromI32(0);
        owner.save();
    }
}

export function updateVotingWeight(
    address: Bytes,
    rank: BigInt,
    blockNumber: BigInt,
    action: string = "ADD_POWER",
): void {
    let power = SOLDIER_POWER;
    if (rank == SERGEANT_RANK) {
        power = SERGEANT_POWER;
    } else if (rank == CORPORAL_RANK) {
        power = CORPORAL_POWER;
    }

    let ownerAddress = address.toHexString();
    let owner = Owner.load(ownerAddress);
    if (owner) {
        if (action == "REMOVE_POWER") {
            owner.votingWeight = owner.votingWeight.minus(power);
        } else {
            owner.votingWeight = owner.votingWeight.plus(power);
        }
        owner.save();
        addHistoricalVotingWeight(address, owner.votingWeight, blockNumber);
    }
}

export function addHistoricalVotingWeight(
    address: Bytes,
    weight: BigInt,
    blockNumber: BigInt,
): void {
    let id = address.toHexString() + blockNumber.toString();
    let votingWeight = VotingWeight.load(id);

    if (votingWeight == null) {
        votingWeight = new VotingWeight(id);
        votingWeight.address = address;
    }

    votingWeight.weight = weight;
    votingWeight.block = blockNumber;
    votingWeight.save();
}

