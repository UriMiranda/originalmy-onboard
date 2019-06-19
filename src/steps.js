const Handlebars = require("handlebars");
import { request, extend } from "./util";

export class StepsFactory {
  constructor(type, props) {
    const vm = this;
    return new vm._factories[type](props);
  }

  static register(type, obj) {
    if (this._factories[type] == undefined) this._factories[type] = {};
    this._factories[type] = obj;
  }
}

export class Step {
  constructor(options) {
    this.defaultOptions = {};
    this.options = extend(
      {},
      this.defaultOptions,
      options != null ? options : {}
    );
  }
  start() {
    document.querySelector("#omy-step-container").innerHTML = this.template();
  }
}

export class AcceptTerms extends Step {
  template() {
    return `\<div class="omy-onboard-step omy-onboard-accept-term">
    <div class="omy-onboard-accept-term__text">
      <strong>Política de Privacidade</strong>
      <p>
        A OriginalMy coleta dados pessoais com a finalidade de prestar seus
        serviços. Nós somos comprometidos a preservar a privacidade e segurança de
        nossos usuários, com tal processamento de dados sendo feito em estrita
        conformidade às leis e regulamentos aplicáveis, em particular com o
        Regulamento Geral de Proteção de Dados da União Europeia. É altamente
        recomendado que os usuários leiam com atenção a presente Política de
        Privacidade.
      </p>
  
      <p>
        1. Sobre a OriginalMy: ORIGINALMY BLOCKCHAIN CERTIFICADORA DIGITAL LTDA,
        Av João De Barros, 155, Conj 174-B Socorro, São Paulo, SP, CEP 04764090,
        Brasil. E-mail: contato@originalmy.com. Os responsáveis pelo projeto podem
        ser contatados pelo e-mail contato@originalmy.com.
      </p>
  
      <p>
        2. Dados coletados: A fim de prestar seus serviços, a OriginalMy coleta
        dados tais como: nome completo, data de nascimento, e-mail, telefone,
        número de CPF e/ou passaporte, foto selfie, foto de comprovante de
        identidade e comprovante de endereço.
      </p>
  
      <p>
        3. Finalidade dos dados coletados: Fornecimento de produtos e serviços,
        incluindo criação de identidade blockchain, certificação de contratos,
        registro de autenticidade e certificação de documentos através de serviço
        notarial. Além disso, a OriginalMy também utiliza dados para fins de
        marketing e comunicação, incluindo a divulgação de produtos, serviços,
        atividades, promoções, campanhas e eventos nos quais a OriginalMy faça
        parte, bem como informações de suporte ao usuário, por e-mail e/ou SMS.
      </p>
  
      <p>
        4. Relação com terceiros: A OriginalMy poderá compartilhar os dados
        pessoais coletados com empresas clientes, que utilizem o plugin da
        OriginalMy para login em suas plataformas, para a finalidade de confirmar
        a identidade do usuário no momento do login. Os dados somente serão
        compartilhados caso o usuário utilize sua identidade blockchain para fazer
        login na plataforma do cliente. Note-se que esses websites possuem suas
        próprias políticas de privacidade, pelas quais a OriginalMy não é
        responsável. Os dados coletados também poderão ser disponibilizados a
        terceiros em caso de determinação legal ou processo judicial.
      </p>
  
      <p>
        5. Armazenamento de dados: Os dados pessoais coletados pela OriginalMy são
        armazenados criptografados, anonimizados e protegidos contra perda, má
        utilização e acesso não autorizado. Os dados armazenados serão utilizados
        somente para os fins específicos para que foram coletados e autorizados.
      </p>
  
      <p>
        6. Direitos do usuário: Os usuários da OriginalMy, em cumprimento ao
        Regulamento Geral de Proteção de Dados, possuem garantidos os direitos à:
        Transparência, informação, acesso e notificação, de modo a estarem cientes
        do tratamento dado a seus dados;
      </p>
  
      <p>
        Retificação de dados incorretos e preenchimento de dados incompletos;
        Apagamento, que pode ser solicitado pelo usuário, além de efetuado
        automaticamente nos casos previstos em lei, como na eventualidade de terem
        deixado de ser necessários para a finalidade pela qual foram coletados
      </p>
  
      <p>
        Oposição quanto à possibilidade de recebimento de comunicações diretas via
        e-mail e/ou SMS;Retirada de consentimento para a coleta e utilização de
        dados, a qualquer tempo; Não sujeição a decisões automatizadas, de modo a
        solicitar intervenção humana sempre que julgarem necessário;
        Portabilidade, solicitando a transferência de seus dados a entidades
        terceiras.
      </p>
  
      <p>
        7. Prazo de armazenamento: Os dados coletados serão armazenados enquanto
        forem necessários para a atividade dos usuários, por um prazo máximo de 6
        meses após a inativação do cadastro do usuário, ou mediante requerimento
        do mesmo ou determinação pela autoridade competente.
      </p>
  
      <p>
        8. Alterações da Política de Privacidade: A presente Política de
        Privacidade pode ser alterada a qualquer momento, com as novas regras
        sendo disponibilizadas neste website e comunicadas ao usuários. Em caso de
        dúvidas quanto à presente Política de Privacidade, favor contatar:
        contato@originalmy.com.
      </p>
    </div>
    <label class="omy-onboard-accept-term__checkbox"
      ><input type="checkbox" />Eu li e aceito os termos.</label
    >
  </div>\
    `;
  }
  title() {
    return "Termos e condições";
  }

  next() {
    return 'Profile'
  }

  previous() {
    return null;
  }
}

export class Profile extends Step {
  title() {
    return "Dados Pessoais";
  }

  next() {
    return 'Profile'
  }

  previous() {
    return 'AcceptTerms';
  }

  template() {
    return `\
    <div class="omy-onboard-step omy-onboard-personal-data">
  <div class="omy-onboard-step__form-group">
    <label>Nome</label>
    <input
      type="text"
      name="user[name]"
      id="omy-onboard-form-user-name"
      required
    />
  </div>
  <div class="omy-onboard-step__form-group">
    <label>Email</label>
    <input
      type="text"
      name="user[email]"
      id="omy-onboard-form-user-email"
      required
    />
  </div>

  <div class="omy-onboard-step__form-group">
    <label>CPF</label>
    <input
      type="text"
      name="user[cpf]"
      id="omy-onboard-form-user-document"
      required
    />
  </div>
  <div class="omy-onboard-step__form-group">
    <label>Celular</label>
    <input
      type="text"
      name="user[phone]"
      id="omy-onboard-form-user-phone"
      required
    />
  </div>
  <div class="omy-onboard-step__form-group">
    <label>Nacionalidade</label>
    <select name="user[country]" id="omy-onboard-form-user-country" required>
      <option value="AF">Afghanistan</option
      ><option value="AX">Åland Islands</option
      ><option value="AL">Albania</option
      ><option value="DZ">Algeria</option
      ><option value="AS">American Samoa</option
      ><option value="AD">AndorrA</option
      ><option value="AO">Angola</option
      ><option value="AI">Anguilla</option
      ><option value="AQ">Antarctica</option
      ><option value="AG">Antigua and Barbuda</option
      ><option value="AR">Argentina</option
      ><option value="AM">Armenia</option
      ><option value="AW">Aruba</option
      ><option value="AU">Australia</option
      ><option value="AT">Austria</option
      ><option value="AZ">Azerbaijan</option
      ><option value="BS">Bahamas</option
      ><option value="BH">Bahrain</option
      ><option value="BD">Bangladesh</option
      ><option value="BB">Barbados</option
      ><option value="BY">Belarus</option
      ><option value="BE">Belgium</option
      ><option value="BZ">Belize</option
      ><option value="BJ">Benin</option
      ><option value="BM">Bermuda</option
      ><option value="BT">Bhutan</option
      ><option value="BO">Bolivia</option
      ><option value="BA">Bosnia and Herzegovina</option
      ><option value="BW">Botswana</option
      ><option value="BV">Bouvet Island</option
      ><option value="BR">Brazil</option
      ><option value="IO">British Indian Ocean Territory</option
      ><option value="BN">Brunei Darussalam</option
      ><option value="BG">Bulgaria</option
      ><option value="BF">Burkina Faso</option
      ><option value="BI">Burundi</option
      ><option value="KH">Cambodia</option
      ><option value="CM">Cameroon</option
      ><option value="CA">Canada</option
      ><option value="CV">Cape Verde</option
      ><option value="KY">Cayman Islands</option
      ><option value="CF">Central African Republic</option
      ><option value="TD">Chad</option
      ><option value="CL">Chile</option
      ><option value="CN">China</option
      ><option value="CX">Christmas Island</option
      ><option value="CC">Cocos (Keeling) Islands</option
      ><option value="CO">Colombia</option
      ><option value="KM">Comoros</option
      ><option value="CG">Congo</option
      ><option value="CD">Congo}, Democratic Republic</option
      ><option value="CK">Cook Islands</option
      ><option value="CR">Costa Rica</option
      ><option value="CI">Cote DIvoire</option
      ><option value="HR">Croatia</option
      ><option value="CU">Cuba</option
      ><option value="CY">Cyprus</option
      ><option value="CZ">Czech Republic</option
      ><option value="DK">Denmark</option
      ><option value="DJ">Djibouti</option
      ><option value="DM">Dominica</option
      ><option value="DO">Dominican Republic</option
      ><option value="EC">Ecuador</option
      ><option value="EG">Egypt</option
      ><option value="SV">El Salvador</option
      ><option value="GQ">Equatorial Guinea</option
      ><option value="ER">Eritrea</option
      ><option value="EE">Estonia</option
      ><option value="ET">Ethiopia</option
      ><option value="FK">Falkland Islands (Malvinas)</option
      ><option value="FO">Faroe Islands</option
      ><option value="FJ">Fiji</option
      ><option value="FI">Finland</option
      ><option value="FR">France</option
      ><option value="GF">French Guiana</option
      ><option value="PF">French Polynesia</option
      ><option value="TF">French Southern Territories</option
      ><option value="GA">Gabon</option
      ><option value="GM">Gambia</option
      ><option value="GE">Georgia</option
      ><option value="DE">Germany</option
      ><option value="GH">Ghana</option
      ><option value="GI">Gibraltar</option
      ><option value="GR">Greece</option
      ><option value="GL">Greenland</option
      ><option value="GD">Grenada</option
      ><option value="GP">Guadeloupe</option
      ><option value="GU">Guam</option
      ><option value="GT">Guatemala</option
      ><option value="GG">Guernsey</option
      ><option value="GN">Guinea</option
      ><option value="GW">Guinea-Bissau</option
      ><option value="GY">Guyana</option
      ><option value="HT">Haiti</option
      ><option value="HM">Heard Island and Mcdonald Islands</option
      ><option value="VA">Holy See (Vatican City State)</option
      ><option value="HN">Honduras</option
      ><option value="HK">Hong Kong</option
      ><option value="HU">Hungary</option
      ><option value="IS">Iceland</option
      ><option value="IN">India</option
      ><option value="ID">Indonesia</option
      ><option value="IR">Iran</option
      ><option value="IQ">Iraq</option
      ><option value="IE">Ireland</option
      ><option value="IM">Isle of Man</option
      ><option value="IL">Israel</option
      ><option value="IT">Italy</option
      ><option value="JM">Jamaica</option
      ><option value="JP">Japan</option
      ><option value="JE">Jersey</option
      ><option value="JO">Jordan</option
      ><option value="KZ">Kazakhstan</option
      ><option value="KE">Kenya</option
      ><option value="KI">Kiribati</option
      ><option value="KP">Korea (North)</option
      ><option value="KR">Korea (South)</option
      ><option value="XK">Kosovo</option
      ><option value="KW">Kuwait</option
      ><option value="KG">Kyrgyzstan</option
      ><option value="LA">Laos</option
      ><option value="LV">Latvia</option
      ><option value="LB">Lebanon</option
      ><option value="LS">Lesotho</option
      ><option value="LR">Liberia</option
      ><option value="LY">Libyan Arab Jamahiriya</option
      ><option value="LI">Liechtenstein</option
      ><option value="LT">Lithuania</option
      ><option value="LU">Luxembourg</option
      ><option value="MO">Macao</option
      ><option value="MK">Macedonia</option
      ><option value="MG">Madagascar</option
      ><option value="MW">Malawi</option
      ><option value="MY">Malaysia</option
      ><option value="MV">Maldives</option
      ><option value="ML">Mali</option
      ><option value="MT">Malta</option
      ><option value="MH">Marshall Islands</option
      ><option value="MQ">Martinique</option
      ><option value="MR">Mauritania</option
      ><option value="MU">Mauritius</option
      ><option value="YT">Mayotte</option
      ><option value="MX">Mexico</option
      ><option value="FM">Micronesia</option
      ><option value="MD">Moldova</option
      ><option value="MC">Monaco</option
      ><option value="MN">Mongolia</option
      ><option value="MS">Montserrat</option
      ><option value="MA">Morocco</option
      ><option value="MZ">Mozambique</option
      ><option value="MM">Myanmar</option
      ><option value="NA">Namibia</option
      ><option value="NR">Nauru</option
      ><option value="NP">Nepal</option
      ><option value="NL">Netherlands</option
      ><option value="AN">Netherlands Antilles</option
      ><option value="NC">New Caledonia</option
      ><option value="NZ">New Zealand</option
      ><option value="NI">Nicaragua</option
      ><option value="NE">Niger</option
      ><option value="NG">Nigeria</option
      ><option value="NU">Niue</option
      ><option value="NF">Norfolk Island</option
      ><option value="MP">Northern Mariana Islands</option
      ><option value="NO">Norway</option
      ><option value="OM">Oman</option
      ><option value="PK">Pakistan</option
      ><option value="PW">Palau</option
      ><option value="PS">Palestinian Territory}, Occupied</option
      ><option value="PA">Panama</option
      ><option value="PG">Papua New Guinea</option
      ><option value="PY">Paraguay</option
      ><option value="PE">Peru</option
      ><option value="PH">Philippines</option
      ><option value="PN">Pitcairn</option
      ><option value="PL">Poland</option
      ><option value="PT">Portugal</option
      ><option value="PR">Puerto Rico</option
      ><option value="QA">Qatar</option
      ><option value="RE">Reunion</option
      ><option value="RO">Romania</option
      ><option value="RU">Russian Federation</option
      ><option value="RW">Rwanda</option
      ><option value="SH">Saint Helena</option
      ><option value="KN">Saint Kitts and Nevis</option
      ><option value="LC">Saint Lucia</option
      ><option value="PM">Saint Pierre and Miquelon</option
      ><option value="VC">Saint Vincent and the Grenadines</option
      ><option value="WS">Samoa</option
      ><option value="SM">San Marino</option
      ><option value="ST">Sao Tome and Principe</option
      ><option value="SA">Saudi Arabia</option
      ><option value="SN">Senegal</option
      ><option value="RS">Serbia</option
      ><option value="ME">Montenegro</option
      ><option value="SC">Seychelles</option
      ><option value="SL">Sierra Leone</option
      ><option value="SG">Singapore</option
      ><option value="SK">Slovakia</option
      ><option value="SI">Slovenia</option
      ><option value="SB">Solomon Islands</option
      ><option value="SO">Somalia</option
      ><option value="ZA">South Africa</option
      ><option value="GS">South Georgia and the South Sandwich Islands</option
      ><option value="ES">Spain</option
      ><option value="LK">Sri Lanka</option
      ><option value="SD">Sudan</option
      ><option value="SR">Suriname</option
      ><option value="SJ">Svalbard and Jan Mayen</option
      ><option value="SZ">Swaziland</option
      ><option value="SE">Sweden</option
      ><option value="CH">Switzerland</option
      ><option value="SY">Syrian Arab Republic</option
      ><option value="TW">Taiwan}, Province of China</option
      ><option value="TJ">Tajikistan</option
      ><option value="TZ">Tanzania</option
      ><option value="TH">Thailand</option
      ><option value="TL">Timor-Leste</option
      ><option value="TG">Togo</option
      ><option value="TK">Tokelau</option
      ><option value="TO">Tonga</option
      ><option value="TT">Trinidad and Tobago</option
      ><option value="TN">Tunisia</option
      ><option value="TR">Turkey</option
      ><option value="TM">Turkmenistan</option
      ><option value="TC">Turks and Caicos Islands</option
      ><option value="TV">Tuvalu</option
      ><option value="UG">Uganda</option
      ><option value="UA">Ukraine</option
      ><option value="AE">United Arab Emirates</option
      ><option value="GB">United Kingdom</option
      ><option value="US">United States</option
      ><option value="UM">United States Minor Outlying Islands</option
      ><option value="UY">Uruguay</option
      ><option value="UZ">Uzbekistan</option
      ><option value="VU">Vanuatu</option
      ><option value="VE">Venezuela</option
      ><option value="VN">Viet Nam</option
      ><option value="VG">Virgin Islands, British</option
      ><option value="VI">Virgin Islands, U.S.</option
      ><option value="WF">Wallis and Futuna</option
      ><option value="EH">Western Sahara</option
      ><option value="YE">Yemen</option
      ><option value="ZM">Zambia</option
      ><option value="ZW">Zimbabwe</option>
    </select>
  </div>
</div>\
    `;
  }
}


StepsFactory.register('AcceptTerms', AcceptTerms);
StepsFactory.register('Profile', Profile);

export default StepsFactory;