package br.com.abelcrvg.gerenciadorsteam

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

private data class Account(
    val id: String,
    val name: String,
    val games: List<String>,
    val status: String,
    val value: Double
)

private val demoAccounts = listOf(
    Account("ST-001", "Conta 001", listOf("Spider-Man 2", "Cyberpunk 2077"), "Disponível", 79.90),
    Account("ST-002", "Conta 002", listOf("Black Myth: Wukong"), "Disponível", 69.90),
    Account("ST-003", "Conta 003", listOf("WWE 2K24", "EA Sports FC 25"), "Reservada", 59.90),
    Account("ST-004", "Conta 004", listOf("Cyberpunk 2077"), "Vendida", 49.90)
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { GerenciadorSteamApp() }
    }
}

@Composable
private fun GerenciadorSteamApp() {
    var selected by remember { mutableIntStateOf(0) }
    val labels = listOf("Início", "Contas", "Jogos", "Vendas")

    MaterialTheme {
        Scaffold(
            bottomBar = {
                NavigationBar {
                    labels.forEachIndexed { index, label ->
                        NavigationBarItem(
                            selected = selected == index,
                            onClick = { selected = index },
                            icon = { Text(label.take(1)) },
                            label = { Text(label) }
                        )
                    }
                }
            }
        ) { padding ->
            Surface(
                modifier = Modifier.fillMaxSize().padding(padding),
                color = MaterialTheme.colorScheme.background
            ) {
                when (selected) {
                    0 -> Dashboard()
                    1 -> AccountsScreen()
                    2 -> Placeholder("Jogos")
                    else -> Placeholder("Vendas")
                }
            }
        }
    }
}

@Composable
private fun Dashboard() {
    val available = demoAccounts.count { it.status == "Disponível" }
    val reserved = demoAccounts.count { it.status == "Reservada" }
    val stockValue = demoAccounts.filter { it.status != "Vendida" }.sumOf { it.value }

    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text("Gerenciador Steam", style = MaterialTheme.typography.headlineMedium)
        Text("Estoque sincronizável", style = MaterialTheme.typography.bodyMedium)
        Spacer(Modifier.height(20.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Metric("Contas", demoAccounts.size.toString())
            Metric("Disponíveis", available.toString())
        }
        Spacer(Modifier.height(10.dp))
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
            Metric("Reservadas", reserved.toString())
            Metric("Estoque", "R$ %.2f".format(stockValue))
        }
        Spacer(Modifier.height(24.dp))
        Text("Contas recentes", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(8.dp))
        AccountList(demoAccounts.take(5))
    }
}

@Composable
private fun AccountsScreen() {
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text("Contas Steam", style = MaterialTheme.typography.headlineMedium)
        Text("Base local de demonstração — o banco compartilhado será conectado na próxima etapa.")
        Spacer(Modifier.height(16.dp))
        AccountList(demoAccounts)
    }
}

@Composable
private fun Metric(label: String, value: String) {
    Card(Modifier.weight(1f)) {
        Column(Modifier.padding(16.dp)) {
            Text(label, style = MaterialTheme.typography.bodyMedium)
            Text(value, style = MaterialTheme.typography.titleLarge)
        }
    }
}

@Composable
private fun AccountList(accounts: List<Account>) {
    LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        items(accounts) { account ->
            Card(Modifier.fillMaxWidth()) {
                Column(Modifier.padding(14.dp)) {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(account.name, style = MaterialTheme.typography.titleMedium)
                        Text(account.status)
                    }
                    Text(account.id, style = MaterialTheme.typography.bodySmall)
                    Text(account.games.joinToString(" • ").ifBlank { "Nenhum jogo" })
                    Text("R$ %.2f".format(account.value))
                }
            }
        }
    }
}

@Composable
private fun Placeholder(title: String) {
    Column(Modifier.fillMaxSize().padding(20.dp)) {
        Text(title, style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(8.dp))
        Text("Módulo preparado para usar o mesmo estoque compartilhado com a versão web.")
    }
}
