import React, { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from "react-native";
import type { PressableProps } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import Snackbar from "react-native-snackbar";
import { getCountryFlag } from "./flag-icons";
import { CURRENCIES, getCurrencyItems } from "./utils";
import FALLBACK_EXCHANGE_DATA from "../../../assets/fallback-exchange-rate.json";
import { CurrencyDropdown } from "../../components/CurrencyDropdown";
import { DATABASE_NAME, TABLE_NAME, connectDb } from "../../db";
import type { FixerExchangeSuccessData, FixerOutput } from "./utils";
import type { HomeScreenProps } from "../../route-types";
import type { SQLiteDatabase } from "react-native-sqlite-storage";

const API_URL =
  "http://data.fixer.io/api/latest?access_key=e84f356aaafeeb2833f72ed1558667a5";

export function Home({ navigation }: HomeScreenProps): React.JSX.Element {
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [baseCurrency, setBaseCurrency] = useState<string | null>(null);
  const [conversionCurrency, setConversionCurrency] = useState<string | null>(
    null
  );
  const [database, setDatabase] = useState<SQLiteDatabase | null>(null);
  const [currencyExchangeData, setCurrencyExchangeData] = useState<
    Record<string, number>
  >({});

  const { isConnected } = useNetInfo();

  const exchangeRate = useMemo(() => {
    let output = 0;
    if (
      typeof conversionCurrency === "string" &&
      typeof baseCurrency === "string"
    ) {
      output =
        currencyExchangeData[conversionCurrency] /
        currencyExchangeData[baseCurrency];
    }
    return output;
  }, [baseCurrency, conversionCurrency, currencyExchangeData]);

  const handleConvertButtonPress: PressableProps["onPress"] = () => {
    const amt = Number.parseFloat(amount);
    if (Number.isNaN(amt) === true) {
      return Snackbar.show({
        text: "Enter valid amount",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#E8290B",
      });
    }

    Keyboard.dismiss();

    if (typeof baseCurrency !== "string") {
      return Snackbar.show({
        text: "Select base currency",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#E8290B",
      });
    }

    if (typeof conversionCurrency !== "string") {
      return Snackbar.show({
        text: "Select conversion currency",
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: "#E8290B",
      });
    }

    const output = amt * exchangeRate;

    Vibration.vibrate(300);
    setConvertedAmount(output);
  };

  const handleResetButtonPress: PressableProps["onPress"] = () => {
    setAmount("");
    setConvertedAmount(0);
    setBaseCurrency(null);
    setConversionCurrency(null);
    Keyboard.dismiss();
    Vibration.vibrate(300);
  };

  const handleInterchange: PressableProps["onPress"] = () => {
    setConvertedAmount(0);
    setBaseCurrency(conversionCurrency);
    setConversionCurrency(baseCurrency);
  };

  useEffect(() => {
    let db: SQLiteDatabase | null = null;
    async function initDB(): Promise<void> {
      db = await connectDb(DATABASE_NAME);
      setDatabase(db);
      const CreateExchangeDBQuery = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        date TEXT,
        rates JSON
    )`;
      await db.executeSql(CreateExchangeDBQuery);
    }

    initDB().catch((err) => {
      console.log(err);
      db?.close().catch(console.log);
    });

    return () => {
      db?.close().catch(console.log);
    };
  }, []);

  useEffect(() => {
    setConvertedAmount(0); // Reset converted amount whenever base or conversoon currency changes
  }, [baseCurrency, conversionCurrency]);

  useEffect(() => {
    async function fetchData() {
      if (database !== null) {
        let data: Record<string, number> = {};
        const GetTodayExchangeDataQuery = `Select rates FROM ${TABLE_NAME}`;
        const result = await database.executeSql(GetTodayExchangeDataQuery);
        if (result[0].rows.length > 0) {
          const stringifiedData = result[0].rows.item(result[0].rows.length - 1)
            .rates as string;
          data = (JSON.parse(stringifiedData) as Record<string, number>) ?? {};
        } else {
          if (isConnected !== true) {
            navigation.navigate("offline");
          } else {
            const res = (await (await fetch(API_URL)).json()) as FixerOutput;
            if (res.success === true) {
              data = res.rates ?? {};
              const InsertTodayExchangeDataQuery = `INSERT INTO ${TABLE_NAME} (date, rates) VALUES (Date(?), ?)`;
              await database.executeSql(InsertTodayExchangeDataQuery, [
                res.date,
                JSON.stringify(res.rates),
              ]);
            } else {
              throw new Error("API failed to fetch data.");
            }
          }
        }
        setCurrencyExchangeData(data);
      }
    }

    fetchData().catch(() => {
      const { rates = {}, date } =
        FALLBACK_EXCHANGE_DATA as FixerExchangeSuccessData;
      setCurrencyExchangeData(rates);
      Snackbar.show({
        text: `Unable to Fetch Latest data, providing exchange rates of ${new Date(
          date
        ).toLocaleDateString(undefined, { dateStyle: "medium" })}.`,
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "#DFAF2B",
      });
    });
  }, [database, isConnected, navigation]);

  return (
    <>
      <Text style={styles.title}>Currency Converter</Text>
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Converted Amount</Text>
        <Text style={styles.result}>{`${convertedAmount.toFixed(2)} ${
          typeof conversionCurrency === "string" &&
          typeof baseCurrency === "string"
            ? getCountryFlag(conversionCurrency)
            : ""
        }`}</Text>
        <Text>
          {typeof conversionCurrency === "string" &&
          typeof baseCurrency === "string"
            ? `(${CURRENCIES[conversionCurrency as keyof typeof CURRENCIES]})`
            : undefined}
        </Text>
        {typeof conversionCurrency === "string" &&
        typeof baseCurrency === "string" ? (
          <Text
            style={
              styles.resultTitle
            }>{`Current Exchange Rate (${getCountryFlag(
            baseCurrency
          )} - ${getCountryFlag(conversionCurrency)})`}</Text>
        ) : undefined}
        <Text style={styles.result}>
          {typeof conversionCurrency === "string" &&
          typeof baseCurrency === "string"
            ? exchangeRate.toFixed(2)
            : undefined}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          keyboardType="number-pad"
          placeholder="Enter amount"
          style={styles.amountInput}
        />
      </View>
      <View style={styles.btnContainer}>
        <Pressable
          onPress={handleConvertButtonPress}
          android_ripple={{
            color: "#67E6DC",
          }}
          style={styles.convertBtn}>
          <Text style={styles.convertBtnText}>Convert</Text>
        </Pressable>
        <Pressable
          onPress={handleResetButtonPress}
          android_ripple={{
            color: "#67E6DC",
          }}
          style={styles.resetBtn}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </Pressable>
      </View>
      <View style={styles.dropdownContainer}>
        <CurrencyDropdown
          value={baseCurrency}
          setValue={setBaseCurrency}
          items={getCurrencyItems()}
          containerStyle={styles.currencyDropdownFrom}
        />
        <Pressable onPress={handleInterchange}>
          <Text style={styles.resetBtnText}>
            <Text style={styles.interchangeBtnText}>{"\u21cc"}</Text>
          </Text>
        </Pressable>
        <CurrencyDropdown
          value={conversionCurrency}
          setValue={setConversionCurrency}
          items={getCurrencyItems()}
          containerStyle={styles.currencyDropdownTo}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#25CCF7",
    fontFamily: "cursive",
  },
  resultContainer: {
    marginVertical: 24,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#25CCF7",
    paddingVertical: 16,
    borderRadius: 12,
  },
  resultTitle: {
    color: "#ffffff",
    fontSize: 18,
  },
  result: {
    color: "#2C3335",
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: "row",
    gap: 10,
    marginVertical: 16,
  },
  currencyDropdownFrom: {
    flexShrink: 1,
  },
  currencyDropdownTo: {
    flexShrink: 1,
  },
  amountContainer: {
    gap: 12,
  },
  amountLabel: {
    fontSize: 16,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#99AAAB",
    borderRadius: 8,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },
  convertBtn: {
    backgroundColor: "#25CCF7",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  resetBtn: {
    backgroundColor: "#25CCF7",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  convertBtnText: {
    color: "#ffffff",
  },
  resetBtnText: {
    color: "#ffffff",
  },
  interchangeBtnText: {
    color: "black",
    fontSize: 28,
  },
});
