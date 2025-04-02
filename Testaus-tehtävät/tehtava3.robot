*** Settings ***
Library    Browser

*** Variables ***
&{PASSWORD}    secret=Salasana123

*** Test Cases ***
Test Web Form Elements
    New Browser    chromium    headless=No
    New Page       https://www.selenium.dev/selenium/web/web-form.html

    # Odotetaan lomakkeen latautumista
    Wait For Elements State    css=form    visible    timeout=10s

    # 🟢 1. Tekstikenttä
    Type Text    css=input[name="my-text"]    Esimerkki tekstiä

    # 🟢 2. Salasana (nyt muuttujana, ei suoraan)
    Type Text    css=input[name="my-password"]    ${PASSWORD}

    # 🟢 3. Tekstialue
    Type Text    css=textarea[name="my-textarea"]    Tämä on esimerkkiviesti.

    # 🟢 6. Pudotusvalikko
    Select Options By    css=select[name="my-select"]    label    Two

    # 🟢 7. Datalist-dropdown


    Wait For Elements State    css=ul#my-datalist option    visible    timeout=10s

    # Syötä vaihtoehto suoraan tekstikenttään
    Type Text    css=input[list="my-datalist"]    San Francisco

    # Odota hetki ja varmista, että oikea vaihtoehto valitaan
    Wait For Elements State    css=ul#my-datalist option[value="San Francisco"]    visible    timeout=5s

    # Valitse vaihtoehto
    Press Keys    css=input[list="my-datalist"]    ARROW_DOWN    ENTER


    # 🟢 8. Tiedoston valinta
    Set File Input    css=input[type="file"]    ${CURDIR}/testfile.txt

    # 🟢 9. Checkboxit
    Click    css=input[name="my-checkbox"]
    Click    css=input[id="my-check-2"]

    # 🟢 10. Radiopainikkeet
    Click    css=input[name="my-radio"][value="option2"]

    # 🟢 11. Color picker
    Type Text    css=input[type="color"]    #0000FF

    # 🟢 12. Date picker
    Type Text    css=input[type="date"]    2024-12-31
    Press Keys    css=input[type="date"]    ENTER

    # 🟢 13. Range slider
    Execute Javascript    document.querySelector('input[type="range"]').value = 100

    # 🟢 14. Lähetä lomake
    Click    css=button
    Wait For Elements State    id=message    visible    timeout=5s
    ${message_text}=    Get Text    id=message
    Should Be Equal As Strings    ${message_text}    Received!

    # Sulje selain
    Close Browser
