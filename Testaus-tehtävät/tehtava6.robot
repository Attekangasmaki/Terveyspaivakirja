*** Settings ***
Library     Browser     	    auto_closing_level=SUITE
Library     CryptoLibrary     variable_decryption=True   #Kryptatut muuttujat puretaan automaattisesti

*** Variables ***
${Username}    crypt:PsdqLBeaDCQ9q8fSWPJUHO0glAtwgI3ef0UK0ZBd2RXHRzR4sMP+YqgMA/fjSAOMFIknOUnPoU9Ql/rj
${Password}    crypt:aYG5rTTc66vX9/i4HJfsTWPATkHy/DBmYRUw0ICi4TLcKvAOwNjSpZzaXlV7IJPRREbqDWSQzJZo

*** Test Cases ***
Test Login Page
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/src/pages/login.html
    Get Title      ==    Kirjaudu sisään  
    Type Text      [name="username"]        ${Username}    delay=0.1 s 
    Type Text      [name="password"]        ${Password}    delay=0.1 s
    Click With Options    css=.login-button    delay=2 s
    Get Text       id=loginResponse    !=    Virheellinen käyttäjätunnus tai salasana