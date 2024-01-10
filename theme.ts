import { extendTheme, theme } from "@chakra-ui/react";

export default extendTheme({
    colors: {
        primary: theme.colors["yellow"]
    },
    styles: {
        global: {
            body: {
                backgroundColor: "primary.500"
            }
        }
    }
})