# pumpfuntokenbuyer
multi-wallet trading bot on pump.fun, design for token operators

use npm run dev to start

tbd: 现在直接call合约是给合约send钱，不能实际购买

Idls：
pump_swap_idl.json
|Instruction|Type|
|---|---|---|---|
0	buy	Instruction
1	collect_creator_fee	Instruction
2	create	Instruction
3	extend_account	Instruction
4	initialize	Instruction
5	migrate	Instruction
6	sell	Instruction
7	set_creator	Instruction
8	set_metaplex_creator	Instruction
9	set_params	Instruction
10	update_global_authority	Instruction
0	BondingCurve	Account
1	Global	Account
0	BondingCurve	Type
1	CollectCreatorFeeEvent	Type
2	CompleteEvent	Type
3	CompletePumpAmmMigrationEvent	Type
4	CreateEvent	Type
5	ExtendAccountEvent	Type
6	Global	Type
7	SetCreatorEvent	Type
8	SetMetaplexCreatorEvent	Type
9	SetParamsEvent	Type
10	TradeEvent	Type
11	UpdateGlobalAuthorityEvent	Type
