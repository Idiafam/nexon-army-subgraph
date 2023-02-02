import {
  TransferSingle,
} from '../generated/NexonArmyNFT/NexonArmyNFT';
import {
  Donation,
} from '../generated/NexonDonation/NexonDonation';
import { NFT } from '../generated/schema';
import {
  createOwner,
  nexonArmyContract,
  updateVotingWeight,
} from './helpers';

export function handleNewDonation(
  event: Donation
): void {

  let tokenIds = event.params.tokenIds;

  for (let i = 0; i < tokenIds.length; i++) {
    let tokenId = tokenIds[i];
    let nft = new NFT(tokenId.toString());
    nft.rank = nexonArmyContract.getRank(tokenId);
    nft.owner = event.params.donor.toHexString();
    nft.save();
    createOwner(event.params.donor);
    updateVotingWeight(event.params.donor, nft.rank, event.block.number);
  }
}

export function handleTransferSingle(
  event: TransferSingle
): void {
  let tokenId = event.params.id;

  let nft = NFT.load(tokenId.toString());
  if (nft != null) {
    nft.owner = event.params.to.toHexString();
    nft.save();
    updateVotingWeight(event.params.to, nft.rank, event.block.number);
    updateVotingWeight(event.params.from, nft.rank, event.block.number, "REMOVE_POWER");
  }
}
