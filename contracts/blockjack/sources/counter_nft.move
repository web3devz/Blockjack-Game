/*
/// Module: blockjack
module onechain_blockjack::counter_nft;
*/
module onechain_blockjack::counter_nft {
    // Imports
    use sui::bcs::{Self};

    // Structs
    public struct Counter has key {
        id: UID,
        count: u64,
    }

    // Functions
    /// Creates a new counter object & transfers it to the sender.
    public entry fun mint_and_transfer(ctx: &mut TxContext) {
        let counter = Counter {
            id: object::new(ctx),
            count: 0
        };

        transfer::transfer(counter, ctx.sender());
    }

    /// Internal function to increment the counter by 1.
    fun increment(self: &mut Counter) {
        self.count = self.count + 1;
    }

    /// Calculates the Counter NFT ID + count. Then it increases the count by 1 and returns the appended bytes.
    public fun increment_and_get(self: &mut Counter): vector<u8> {
        let mut vrf_input = object::id_bytes(self);
        let count_to_bytes = bcs::to_bytes(&count(self));
        vrf_input.append(count_to_bytes);
        self.increment();
        vrf_input
    }

    /// Deletes the counter object.
    public entry fun burn(self: Counter) {
        let Counter { id, count: _ } = self;
        object::delete(id);
    }

    /// Returns the current count of the counter object.
    public fun count(self: &Counter): u64 {
        self.count
    }

}
