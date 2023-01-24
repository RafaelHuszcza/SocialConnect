export default function handleError(err) {
  const mainData = err.response;
  if (!mainData) return "Erro ao realizar operação";
  const status = mainData?.status;
  if (status === 400) {
    const errorDataEmail =
      mainData.data != undefined
        ? mainData.data.lenght != 0
          ? mainData.data[0].email
            ? "Email já Cadastrado"
            : ""
          : ""
        : "";

    const errorDataCpf_or_cnpj =
      mainData.data != undefined
        ? mainData.data.lenght != 0
          ? mainData.data[0].cpf_or_cnpj
            ? "CPF ou CNPJ já Cadastrado"
            : ""
          : ""
        : "";

    if (errorDataEmail != "") {
      return errorDataEmail;
    }

    if (errorDataCpf_or_cnpj != "") {
      return errorDataCpf_or_cnpj;
    }
  }

  const data = mainData?.data?.detail;

  if (!status || !data) return "Erro ao realizar operação";

  if (String(status).startsWith(5))
    return "Erro ao realizar operação no banco de dados";
  switch (data) {
    // LOGIN normal
    case "No active account found with the given credentials":
      return "Usuário não encontrado. Cheque as credenciais";
    case "Invalid password.":
      return "Senha inválida";
    case "Given token not valid for any token type":
      return "Token Inválido - Atualize a Página ( F5 ) ";

    // Register: link para troca de senha
    case "user with this email address already exists.":
      return "Usuário não encontrado";

    // ROOM
    case "Room name already exists":
      return "Uma sala com esse nome já existe";
    case "Room code_id already in use":
      return "Uma sala com essa TAG já existe";
    case "Code_id in already use":
      return "Uma sala com essa TAG já existe";
    case "Name in already use":
      return "Uma sala com esse nome já existe";
    case "Area must be string":
      return "O setor da sala deve ser uma string";
    case "Area is required":
      return "A sala deve estar associada a um setor";
    case "Code_id must have 12 caractheres":
      return "A TAG da sala deve conter 12 caractéres";

    // TOOL
    case "Tool does not exist":
      return "Não foi encontrada uma ferramenta";
    case "Code already in use":
      return "Uma sala com esse código já existe";
    case "Lifetime must be number":
      return "O tempo de vida deve ser um número";
    case "Lifetime must be integer":
      return "O tempo de vida deve ser um número inteiro";
    case "Lifetime is required":
      return "A ferramenta deve conter um tempo de vida";
    case "Coment must be string":
      return "O comnentário da ferramenta deve ser uma string";
    case "Code is required":
      return "A sala deve conter um código";
    case "Room_id must be number":
      return "O identificador da sala deve ser um número";
    case "Room_id must be integer":
      return "O identificador da sala deve ser um número inteiro";
    case "Room_id is required":
      return "A sala deve conter um identificador";

    // USER
    case "Setor must be string":
      return "O setor deve ser uma string";
    case "Setor is required":
      return "O usuário deve estar associado a um setor";
    case "Invalid matricula":
      return "A matrícula do usuário é inválida";
    case "Matricula is required":
      return "O usuário deve conter uma matrícula";
    case "Email must be string":
      return "O e-mail do usuário deve ser uma string";
    case "Email is already in use":
      return "Já existe um usuário com o email fornecido";
    case "Not a valid email":
      return "O e-mail do do usuário é inválido";
    case "E-mail is required":
      return "O usuário deve conter um e-mail";
    case "The password must be between 6 to 20 characters long and contain special characters.":
      return "A senha deve ter tamanho de 6 a 20 e conter caractéres epeciais";
    case "User type must be string":
      return "O tipo de usuário deve ser uma string";
    case "User type is required":
      return "O usuário deve ser de um tipo";

    // CASOS COMPARTILHADOS
    case "Room does not exist":
      switch (message) {
        case "Error when getting Room":
          return "Sala não encontrada";
        case "Error when updating Room":
          return "Sala não encontrada";
        case "Error deleting":
          return "Sala não encontrada";
        case "Error when posting tool.":
          return "A sala selecionada não foi encontrada";
        default:
          return "Sala não encontrada";
      }

    case "Id must have only digits":
      switch (message) {
        case "Error when geting Room.":
          return "O identificador da sala deve ser um numeral";
        case "Error when registering tool.":
          return "O identificador da ferramenta deve ser um numeral";
        case "Error when updating tool.":
          return "O identificador da ferramenta deve ser um numeral";
        default:
          return "O identificador da ferramenta deve ser um numeral";
      }

    case "Send at least one value to update":
      switch (message) {
        case "Error when updating Room":
          return "Nenhum campo modificado. A edição sala de requer ao menos uma modificação";
        case "Error when updating user":
          return "Nenhum campo modificado. A edição de usuário requer ao menos uma modificação";
        case "Error when updating tool":
          return "Nenhum campo modificado. A edição de ferramenta ao menos uma modificação";
        default:
          return "Nenhum campo modificado. A edição requer ao menos uma modificação";
      }

    case "Name is required":
      return "O nome é obrigatório";
    case "Name must be string":
      return "O nome deve ser uma string";
    case "Code_id must be string":
      return "A TAG deve ser uma string";
    case "Code_id must have 24 caractheres":
      return "A TAG deve conter 24 caractéres";
    case "Code_id is required":
      return "A TAG é obrigatória";

    default:
      return "Erro ao realizar operação no servidor";
  }
}

// ERROS SEM TRATAMENTO
// login post:
// 'Login error', 'User does not exist. Check credentials.'
// 'Login error', 'Password has expired, please update your password.'
// 'Login error', 'Invalid password.'

// login: getPasswordLink (to change password)
// "User with given email doesn't exist"
// 'Error when getting Room', 'Room does not exist'

// getRoom:
// 'Error when geting Room.', 'Id must have only digits'

// post room:
// 'Error when registering Room', 'Room name already exists'
// 'Error when registering Room', 'Room code_id already in use'

// put room:
// 'Error when updating Room', 'Code_id in already use'
// 'Error when updating Room', 'Name in already use'
// 'Error when updating Room', 'Room does not exist'

// delete room
// 'Error deleting', 'Room does not exist'

// yup-room: - 'Error when registering Room.' -- 'Error when updating Room.'
// 'Name must be string'
// 'Name is required'
// 'Area must be string'
// 'Area is required'
// 'Code_id must be string'
// 'Code_id must have 12 caractheres'
// 'Code_id must have 12 caractheres'
// 'Code_id is required'

// getTool:
// 'Error when registering tool.', 'Id must have only digits'
// 'Error when getting tool.', 'Tool does not exist'

// postTool:
// 'Error when posting tool.', 'Room does not exist'
// 'Error when posting tool.', 'Code id already in use'
// 'Error when posting tool.', 'Code already in use'

// putTool:
// 'Error when updating tool.', 'Id must have only digits'
// 'Error when posting tool.', 'Room does not exist'
// 'Error when updating tool.', 'Code id already in use'
// 'Error when updating tool.', 'Code already in use'

// deleteTool:
// 'Error when deleting tool.', 'Id must have only digits'
// 'Error deleting', 'Tool does not exist'

// yup-Tool - - 'Error when posting tool.' -- 'Error when updating tool.'
// 'Name must be string'
// 'Name is required'
// 'Code_id must be string'
// 'Code_id must have 24 caractheres'
// 'Code_id is required'
// 'Lifetime must be number'
// 'Lifetime must be integer'
// 'Lifetime is required'
// 'Coment must be string'
// 'Code is required'
// 'Room_id must be number'
// 'Room_id must be integer'
// 'Room_id must be number'
// 'Room_id must be integer'
// 'Room_id is required'

// yup-user:
// 'Name must be string'
// 'Name is required'
// 'Setor must be string'
// 'Setor is required'
// 'Invalid matricula'
// 'Matricula is required'
// 'Email must be string'
// 'Not a valid email'
// 'E-mail is required'
// 'The password must be between 6 to 20 characters long and contain special characters.'
// 'Code_id must be string'
// 'Code_id must have 24 caractheres'
// 'Code_id is required'
// 'Code_id must have 24 caractheres'
// 'User type must be string'
// 'User type is required'

// 'Error when updating Room', 'Send at least one value to update'
// 'Error when updating user', 'Send at least one value to update'
// 'Error when updating tool', 'Send at least one value to update'
