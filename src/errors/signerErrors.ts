/**
 * @description List of known bugs
 * @message {string} - the string or part of a string returned by the signer extension. It is searched in an array
 * @title {string} - alert title
 * @desc {string} - description of the solution to the problem
 */
const signerErrors = [
  //sometimes the extension breaks and stops being called. Only reinstall helps.
  {
    message: 'Cannot read properties of undefined (reading \'error\')',
    title: 'Signer error',
    desc: 'Please reinstall Signer',
  },
  //if password is not entered in vault
  {
    message: 'Please unlock the Signer to read key',
    title: 'Signer in locked',
    desc: 'Please unlock the Signer to read key',
  },
  //if the extension is not downloaded
  {
    message: 'Please download CasperLabs Signer',
    title: 'Signer not found',
    desc: 'Please download CasperLabs Signer',
  },
  //when a transaction request is rejected
  {
    message: 'User Cancelled Signing',
    title: 'Payment cancelled',
    desc: 'You are cancelled payment in Signer',
  },
  //with no storage created, with no account created, with disconnect
  {
    message: 'Please connect to the Signer to read key',
    title: 'Signer vault not found',
    desc: 'Please connect to the Signer to read key',
  },
  //Occurs if the user has not made any transactions or has an empty account
  {
    message:
      'state query failed: ValueNotFound("Failed to find base key at path: Key',
    title: 'User not found',
    desc: 'Try to find a top-up on your wallet and repeat the action',
  },
  //The key given by the extension itself is incorrect
  {
    message: 'Invalid public key',
    title: 'Invalid public key',
    desc: 'Invalid public key',
  },
  //Occurs when the Internet is disconnected
  {
    message: 'Failed to fetch',
    title: 'Network error',
    desc: 'Check your internet connection',
  },
  //Occurs when the Internet is disconnected
  {
    message: 'Network error',
    title: 'Network error',
    desc: 'Check your internet connection',
  },
  {
    message: 'Request failed with status code 500',
    title: 'Server error',
    desc: 'Error connecting to the Signer server',
  },
  {
    message: 'Transaction aborted',
    title: 'Transaction aborted',
    desc: 'Check your internet connection',
  },
  {
    message: 'insufficient balance in account',
    title: 'Insufficient balance',
    desc: 'Your account does not have sufficient funds for the transaction',
  },
];

export { signerErrors };
