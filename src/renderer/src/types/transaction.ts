export interface TransactionWeb3Props {
  priority_fee: string
  tx_burnt_fee: string
  raw_input: string
  result: string
  hash: string
  max_fee_per_gas: string
  revert_reason: RevertReasonProps
  confirmation_duration: number[]
  type: number
  token_transfers_overflow: string
  confirmations: number
  position: number
  max_priority_fee_per_gas: string
  transaction_tag: string
  created_contract: string
  value: string
  from: TransactionFromProps
  gas_used: string
  status: string
  to: TransactionToProps
  authorization_list: []
  method: string
  fee: {
    type: string
    value: string
  }
  actions: []
  gas_limit: string
  gas_price: string
  decoded_input: {
    method_call: string
    method_id: string
    parameters: ParametersTransactionProps[]
  }
  token_transfers: TokensTransferProps[]
  base_fee_per_gas: string
  timestamp: string
  nonce: string
  transaction_types: string[]
  exchange_rate: string
  block_number: number
  has_error_in_internal_transactions: boolean
}

export interface TokensTransferProps {
  block_hash: string
  block_number: string
  from: TransactionFromProps
  log_index: number
  method: string
  timestamp: string
  to: TransactionToProps
  token: TokenProps
  total: {
    decimals: string
    value: string
  }
  transaction_hash: string
  type: string
}

export interface RevertReasonProps {
  method_call: string
  method_id: string
  parameters: ParametersRevertReason[]
}

export interface ParametersRevertReason {
  name: string
  type: string
  value: string
}

export interface ParametersTransactionProps {
  name: string
  type: string
  value: string
}

interface TransactionFromProps {
  ens_domain_name: string
  hash: string
  implementations: []
  is_contract: boolean
  is_scam: boolean
  is_verified: boolean
  metadata: string
  name: string
  private_tags: []
  proxy_type: string
  public_tags: []
  watchlist_names: []
}

interface TransactionToProps {
  ens_domain_name: string
  hash: string
  implementations: []
  is_contract: boolean
  is_scam: boolean
  is_verified: boolean
  metadata: string
  name: string
  private_tags: []
  proxy_type: string
  public_tags: []
  watchlist_names: []
}

interface TokenProps {
  address: string
  circulating_market_cap: number
  decimals: string
  exchange_rate: number
  holders: string
  icon_url: string
  name: string
  symbol: string
  total_supply: string
  type: string
  volume_24h: string
}
