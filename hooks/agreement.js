import * as anchor from '@project-serum/anchor'
import { useEffect, useMemo, useState } from 'react'
import { TODO_PROGRAM_PUBKEY } from '../constants'
import todoIDL from '../constants/agreement.json'

import { SystemProgram } from '@solana/web3.js'
import { utf8 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey'
import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import { authorFilter } from '../utils'
import { set } from '@project-serum/anchor/dist/cjs/utils/features'


export function useAgreement(){

    const {connection} = useConnection()
    const {publicKey} = useWallet()
    const anchorWallet = useAnchorWallet()

    const [lastTodo, setLastTodo] = useState(0)
    const [contract , setContract] = useState([])

    const [initialized , setInitialized] = useState(false)
    const [transactionPending, setTransactionPending] = useState(false)

    const [ name , setName] = useState("")
    const [person_one_contract_addy , setPerson_one_contract_addy] = useState()
    const [person_two_contract_addy , setPerson_two_contract_addy] = useState()
    const [content , setContent] = useState()
    const [contract_type , setContract_type] = useState()
    const [exp_time , setexp_time] = useState()

    const program = useMemo(() => {
        if (anchorWallet) {
            const provider = new anchor.AnchorProvider(connection, anchorWallet, anchor.AnchorProvider.defaultOptions())
            return new anchor.Program(todoIDL, TODO_PROGRAM_PUBKEY, provider)
        }
    }, [connection, anchorWallet])


    useEffect(() => {
        const findProfileAccount = async() => {
            if(program && publicKey && !transactionPending){
                try{
                    const [profilePda,profileBump] = await findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                    const profileAccount = await program.account.userProfile.fetch(profilePda)

                    if(profileAccount) {
                        setLastTodo(profileAccount.lastContract)
                        setInitialized(true)

                        const constractAccounts = await program.account.contractAccount.all([authorFilter(publicKey.toString())])
                        setContract(constractAccounts)
                    } else {
                        setInitialized(false)
                    }
                } catch (error) {
                    console.log(error)
                    setInitialized(false)
                    setContract([])
                } finally {
                    // setLoading(false)
                }
            }
        }

        findProfileAccount()

    },[publicKey,program,transactionPending])

    const nameHandleChange = (e) => {
        setName(e.target.value)
    }

    const personOneAddyHandler = (e) => {
        setPerson_one_contract_addy(e.target.value)
    }

    const personTwoAddyHandler = (e) => {
        setPerson_two_contract_addy(e.target.value)
    }

    const contentHandler = (e) => {
        setContent(e.target.value)
    }

    const contractTypeHandler = (e) => {
        setContract_type(e.target.value)
    }

    const expTimeHandler = (e) => {
        setexp_time(e.target.value)
    }


    const initializeUser = async () =>{
        console.log("init")
        if(program && publicKey){
            try{
                setTransactionPending(true)
                const [profilePda , profileBump] = findProgramAddressSync([utf8.encode("USER_STATE"),publicKey.toBuffer()],program.programId)
                if(name){
                    const tx=await program.methods.initializeUser(name)
                    .accounts({
                        userProfile : profilePda,
                        authority : publicKey,
                        SystemProgram : SystemProgram.programId,
                    })
                    .rpc()
                    setInitialized(true)
                }
            } catch(error){
                console.log(error)
            } finally {
                setTransactionPending(false)
                setName("")
            }
        }
    }

    const createContract = async () =>{
        if(program && publicKey){
            try{
                setTransactionPending(true)
                const [profilePda,profileBump] = findProgramAddressSync([utf8.encode('USER_STATE'), publicKey.toBuffer()], program.programId)
                const [contractPda,contractBump] = findProgramAddressSync([utf8.encode('CONTRACT_STATE'),publicKey.toBuffer() , Uint8Array.from([lastTodo])],program.programId)
                if (person_one_contract_addy,person_two_contract_addy,content,contract_type,exp_time){
                    await program.methods
                    .createContract(person_one_contract_addy,
                        person_two_contract_addy,
                        content,
                        contract_type,
                        exp_time
                        )
                        .accounts({
                            userAccount : profilePda,
                            contractAccount : contractPda,
                            authority : publicKey,
                            SystemProgram : SystemProgram.programId
                        })
                        .rpc()

                }
            } catch(error){
                console.log(error)
            } finally {
                setTransactionPending(false)
                setPerson_one_contract_addy("")
                setPerson_two_contract_addy("")
                setContent("")
                setContract_type("")
                setexp_time("")
            }
        }
    }

    return {
        initializeUser,
        createContract,
        nameHandleChange,
        personOneAddyHandler,
        personTwoAddyHandler,
        contentHandler,
        contractTypeHandler,
        expTimeHandler,
        name,
        person_one_contract_addy,
        person_two_contract_addy,
        content,
        contract_type,
        exp_time,
        initialized,
        transactionPending,

    }

}